import { createClient } from '@supabase/supabase-js';

// Define the Alumni type
export type Alumni = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    graduation_year: number;
    program: string;
    city?: string;
    country?: string;
    company?: string;
    industry?: string;
    position?: string;
    linkedin_url?: string;
    bio?: string;
}

// Supabase client
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

// For development/demo purposes, if Supabase is not properly set up,
// this mock data will be used.
export const mockAlumni: Alumni[] = [
    {
        id: '1',
        first_name: 'Sophie',
        last_name: 'Martin',
        email: 'sophie.martin@example.com',
        graduation_year: 2022,
        program: 'Business Administration',
        city: 'Paris',
        country: 'France',
        company: 'BNP Paribas',
        industry: 'Finance',
        position: 'Financial Analyst',
        linkedin_url: 'https://linkedin.com/in/sophiemartin',
        bio: 'Passionate about sustainable finance and impact investing.'
    },
    {
        id: '2',
        first_name: 'Thomas',
        last_name: 'Dubois',
        email: 'thomas.dubois@example.com',
        graduation_year: 2022,
        program: 'Finance',
        city: 'Paris',
        country: 'France',
        company: 'Société Générale',
        industry: 'Finance',
        position: 'Risk Management Associate',
        linkedin_url: 'https://linkedin.com/in/thomasdubois',
        bio: 'Specializing in market risk assessment and mitigation strategies.'
    },
    {
        id: '3',
        first_name: 'Emma',
        last_name: 'Bernard',
        email: 'emma.bernard@example.com',
        graduation_year: 2022,
        program: 'Computer Science',
        city: 'Lyon',
        country: 'France',
        company: 'Dassault Systèmes',
        industry: 'Technology',
        position: 'Software Engineer',
        linkedin_url: 'https://linkedin.com/in/emmabernard',
        bio: 'Full-stack developer focused on 3D modeling applications.'
    },
    {
        id: '4',
        first_name: 'Lucas',
        last_name: 'Petit',
        email: 'lucas.petit@example.com',
        graduation_year: 2023,
        program: 'Marketing',
        city: 'Paris',
        country: 'France',
        company: 'L\'Oréal',
        industry: 'Consumer Goods',
        position: 'Digital Marketing Specialist',
        linkedin_url: 'https://linkedin.com/in/lucaspetit',
        bio: 'Creating innovative digital campaigns for beauty products.'
    },
    {
        id: '5',
        first_name: 'Chloé',
        last_name: 'Leroy',
        email: 'chloe.leroy@example.com',
        graduation_year: 2021,
        program: 'Finance',
        city: 'London',
        country: 'United Kingdom',
        company: 'HSBC',
        industry: 'Finance',
        position: 'Investment Banking Analyst',
        linkedin_url: 'https://linkedin.com/in/chloeleroy',
        bio: 'Working on cross-border M&A transactions between Europe and Asia.'
    },
    {
        id: '6',
        first_name: 'Antoine',
        last_name: 'Moreau',
        email: 'antoine.moreau@example.com',
        graduation_year: 2020,
        program: 'Economics',
        city: 'Brussels',
        country: 'Belgium',
        company: 'European Commission',
        industry: 'Government',
        position: 'Economic Policy Advisor',
        linkedin_url: 'https://linkedin.com/in/antoinemoreau',
        bio: 'Focused on EU economic integration policies and trade agreements.'
    },
    {
        id: '7',
        first_name: 'Léa',
        last_name: 'Fournier',
        email: 'lea.fournier@example.com',
        graduation_year: 2022,
        program: 'International Relations',
        city: 'Geneva',
        country: 'Switzerland',
        company: 'United Nations',
        industry: 'International Organizations',
        position: 'Program Coordinator',
        linkedin_url: 'https://linkedin.com/in/leafournier',
        bio: 'Coordinating humanitarian aid programs in developing countries.'
    },
    {
        id: '8',
        first_name: 'Hugo',
        last_name: 'Girard',
        email: 'hugo.girard@example.com',
        graduation_year: 2021,
        program: 'Engineering',
        city: 'Munich',
        country: 'Germany',
        company: 'BMW',
        industry: 'Automotive',
        position: 'Electrical Systems Engineer',
        linkedin_url: 'https://linkedin.com/in/hugogirard',
        bio: 'Developing next-generation electric vehicle battery systems.'
    },
    {
        id: '9',
        first_name: 'Inès',
        last_name: 'Roux',
        email: 'ines.roux@example.com',
        graduation_year: 2023,
        program: 'Data Science',
        city: 'Paris',
        country: 'France',
        company: 'Dataiku',
        industry: 'Technology',
        position: 'Data Scientist',
        linkedin_url: 'https://linkedin.com/in/inesroux',
        bio: 'Applying machine learning to solve business challenges in retail.'
    },
    {
        id: '10',
        first_name: 'Mathieu',
        last_name: 'Lambert',
        email: 'mathieu.lambert@example.com',
        graduation_year: 2022,
        program: 'Finance',
        city: 'Paris',
        country: 'France',
        company: 'Crédit Agricole',
        industry: 'Finance',
        position: 'Corporate Banking Associate',
        linkedin_url: 'https://linkedin.com/in/mathieulambert',
        bio: 'Specialized in financing solutions for SMEs in the tech sector.'
    }
];