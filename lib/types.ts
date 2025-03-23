// lib/types.ts
export interface skemaAlumni {
    id: string;
    first_name?: string;
    last_name?: string;
    graduation_year?: string;
    program?: string;
    company?: string;
    position?: string;
    industry?: string;
    city?: string;
    country?: string;
    linkedin_url?: string;
    experience1_company?: string;
    experience1_position?: string;
    experience1_duration?: string;
    experience2_company?: string;
    experience2_position?: string;
    experience2_duration?: string;
}

// Mapping pour l'affichage des champs
export const FIELD_DISPLAY_NAMES: Record<string, string> = {
    id: 'ID',
    first_name: 'Prénom',
    last_name: 'Nom',
    graduation_year: 'Année de promotion',
    program: 'Programme',
    company: 'Entreprise actuelle',
    position: 'Poste actuel',
    industry: 'Secteur d\'activité',
    city: 'Ville',
    country: 'Pays',
    linkedin_url: 'LinkedIn URL',
    experience1_company: 'Expérience 1 - Entreprise',
    experience1_position: 'Expérience 1 - Poste',
    experience1_duration: 'Expérience 1 - Durée',
    experience2_company: 'Expérience 2 - Entreprise',
    experience2_position: 'Expérience 2 - Poste',
    experience2_duration: 'Expérience 2 - Durée'
};