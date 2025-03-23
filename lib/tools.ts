/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/tools.ts
import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from './supabase';
import { skemaAlumni, FIELD_DISPLAY_NAMES } from './types';

/**
 * Normalise les termes de recherche (supprime les accents, passe en minuscule)
 */
/**
 * Outil de recherche d'alumni en fonction de divers critères
 */
export const searchAlumniTool = tool({
  description: 'Rechercher des alumni selon différents critères',
  parameters: z.object({
    first_name: z.string().optional().describe('Le prénom de l\'alumni'),
    last_name: z.string().optional().describe('Le nom de famille de l\'alumni'),
    graduation_year: z.string().optional().describe('L\'année de diplôme des alumni (ex: 2022)'),
    program: z.string().optional().describe('Le programme d\'études suivi par les alumni'),
    company: z.string().optional().describe('L\'entreprise actuelle où travaillent les alumni'),
    position: z.string().optional().describe('Le poste actuel occupé par les alumni'),
    industry: z.string().optional().describe('Le secteur dans lequel les alumni travaillent (ex: conseil, finance)'),
    city: z.string().optional().describe('La ville où les alumni sont situés'),
    country: z.string().optional().describe('Le pays où les alumni sont situés'),
    experience_company: z.string().optional().describe('Une entreprise où les alumni ont travaillé dans le passé'),
    fields: z.array(z.string()).optional().describe('Liste des champs à inclure dans les résultats'),
    limit: z.number().optional().default(10).describe('Nombre maximum d\'alumni à retourner'),
    offset: z.number().optional().default(0).describe('Offset pour la pagination'),
  }),
  execute: async ({
    first_name, last_name, graduation_year, program, company,
    position, industry, city, country, experience_company,
    fields, limit = 10, offset = 0
  }) => {
    try {
      console.log('Recherche d\'alumni avec les critères:', {
        first_name, last_name, graduation_year, program, company,
        position, industry, city, country, experience_company
      });

      // Sélectionner les colonnes pertinentes
      let columnsToSelect = '*';
      if (fields && fields.length > 0) {
        // S'assurer que l'ID est toujours inclus
        if (!fields.includes('id')) {
          fields.push('id');
        }
        columnsToSelect = fields.join(',');
      }

      // Construire la requête
      let query = supabase.from('skema').select(columnsToSelect);

      // Appliquer les filtres standards
      if (first_name) query = query.ilike('first_name', `%${first_name}%`);
      if (last_name) query = query.ilike('last_name', `%${last_name}%`);
      if (graduation_year) query = query.ilike('graduation_year', `%${graduation_year}%`);
      if (program) query = query.ilike('program', `%${program}%`);
      if (company) query = query.ilike('company', `%${company}%`);
      if (position) query = query.ilike('position', `%${position}%`);
      if (industry) query = query.ilike('industry', `%${industry}%`);
      if (city) query = query.ilike('city', `%${city}%`);
      if (country) query = query.ilike('country', `%${country}%`);

      // Filtre spécial pour les expériences professionnelles passées
      if (experience_company) {
        query = query.or(`experience1_company.ilike.%${experience_company}%,experience2_company.ilike.%${experience_company}%`);
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      // Exécuter la requête
      console.log('Exécution de la requête Supabase');
      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      // Si on a des résultats, les retourner
      if (data && data.length > 0) {
        console.log(`${data.length} alumni trouvés dans la base de données`);

        // Convertir les noms de champs techniques en noms conviviaux si demandé
        const displayData = data.map(alumni => {
          const displayAlumni: Record<string, any> = {};
          Object.entries(alumni).forEach(([key, value]) => {
            const displayKey = FIELD_DISPLAY_NAMES[key] || key;
            displayAlumni[displayKey] = value;
          });
          return displayAlumni;
        });

        return displayData;
      }

      // Si aucun résultat, retourner un tableau vide
      console.log('Aucun résultat trouvé dans la base de données');
      return [];

    } catch (err) {
      console.error('Erreur lors de la recherche d\'alumni:', err);
      return [];
    }
  }
});

/**
 * Outil pour obtenir des alumni aléatoires
 */
export const getRandomAlumniTool = tool({
  description: 'Obtenir un nombre spécifié d\'alumni aléatoires',
  parameters: z.object({
    count: z.number().optional().default(3).describe('Nombre d\'alumni aléatoires à retourner'),
    fields: z.array(z.string()).optional().describe('Liste des champs à inclure dans les résultats')
  }),
  execute: async ({ count = 3, fields }) => {
    try {
      console.log(`Récupération de ${count} alumni aléatoires`);

      // Sélectionner les colonnes pertinentes
      let columnsToSelect = '*';
      if (fields && fields.length > 0) {
        // S'assurer que l'ID est toujours inclus
        if (!fields.includes('id')) {
          fields.push('id');
        }
        columnsToSelect = fields.join(',');
      }

      // Construire la requête
      const { data, error } = await supabase
        .from('skema')
        .select(columnsToSelect)
        .order('id', { ascending: false })  // Une façon de pseudo-randomiser
        .limit(count);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      // Si on a des résultats, les retourner
      if (data && data.length > 0) {
        console.log(`${data.length} alumni aléatoires trouvés dans la base de données`);

        // Convertir les noms de champs techniques en noms conviviaux
        const displayData = data.map(alumni => {
          const displayAlumni: Record<string, any> = {};
          Object.entries(alumni).forEach(([key, value]) => {
            const displayKey = FIELD_DISPLAY_NAMES[key] || key;
            displayAlumni[displayKey] = value;
          });
          return displayAlumni;
        });

        return displayData;
      }

      // Si aucun résultat, retourner un tableau vide
      console.log('Aucun alumni trouvé dans la base de données');
      return [];

    } catch (err) {
      console.error('Erreur lors de la récupération d\'alumni aléatoires:', err);
      return [];
    }
  }
});

// Exporter tous les outils
export const tools = {
  searchAlumni: searchAlumniTool,
  getRandomAlumni: getRandomAlumniTool
};

// Exporter l'interface pour le composant AlumniTable
export type { skemaAlumni };
