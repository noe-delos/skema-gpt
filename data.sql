-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create alumni table if it doesn't exist
CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  graduation_year INTEGER NOT NULL,
  program TEXT NOT NULL,
  city TEXT,
  country TEXT,
  company TEXT,
  industry TEXT,
  position TEXT,
  linkedin_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to alumni table
DROP TRIGGER IF EXISTS update_alumni_modtime ON alumni;
CREATE TRIGGER update_alumni_modtime
BEFORE UPDATE ON alumni
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes for common search queries
CREATE INDEX IF NOT EXISTS idx_alumni_city ON alumni (city);
CREATE INDEX IF NOT EXISTS idx_alumni_industry ON alumni (industry);
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_year ON alumni (graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_program ON alumni (program);
CREATE INDEX IF NOT EXISTS idx_alumni_company ON alumni (company);

-- Truncate the table to start fresh
TRUNCATE TABLE alumni;

-- Insert 100 alumni records
INSERT INTO alumni (first_name, last_name, email, graduation_year, program, city, country, company, industry, position, linkedin_url, bio)
VALUES
  -- Initial 10 alumni
  ('Sophie', 'Martin', 'sophie.martin@example.com', 2022, 'Business Administration', 'Paris', 'France', 'BNP Paribas', 'Finance', 'Financial Analyst', 'https://linkedin.com/in/sophiemartin', 'Passionate about sustainable finance and impact investing.'),
  ('Thomas', 'Dubois', 'thomas.dubois@example.com', 2022, 'Finance', 'Paris', 'France', 'Société Générale', 'Finance', 'Risk Management Associate', 'https://linkedin.com/in/thomasdubois', 'Specializing in market risk assessment and mitigation strategies.'),
  ('Emma', 'Bernard', 'emma.bernard@example.com', 2022, 'Computer Science', 'Lyon', 'France', 'Dassault Systèmes', 'Technology', 'Software Engineer', 'https://linkedin.com/in/emmabernard', 'Full-stack developer focused on 3D modeling applications.'),
  ('Lucas', 'Petit', 'lucas.petit@example.com', 2023, 'Marketing', 'Paris', 'France', 'L''Oréal', 'Consumer Goods', 'Digital Marketing Specialist', 'https://linkedin.com/in/lucaspetit', 'Creating innovative digital campaigns for beauty products.'),
  ('Chloé', 'Leroy', 'chloe.leroy@example.com', 2021, 'Finance', 'London', 'United Kingdom', 'HSBC', 'Finance', 'Investment Banking Analyst', 'https://linkedin.com/in/chloeleroy', 'Working on cross-border M&A transactions between Europe and Asia.'),
  ('Antoine', 'Moreau', 'antoine.moreau@example.com', 2020, 'Economics', 'Brussels', 'Belgium', 'European Commission', 'Government', 'Economic Policy Advisor', 'https://linkedin.com/in/antoinemoreau', 'Focused on EU economic integration policies and trade agreements.'),
  ('Léa', 'Fournier', 'lea.fournier@example.com', 2022, 'International Relations', 'Geneva', 'Switzerland', 'United Nations', 'International Organizations', 'Program Coordinator', 'https://linkedin.com/in/leafournier', 'Coordinating humanitarian aid programs in developing countries.'),
  ('Hugo', 'Girard', 'hugo.girard@example.com', 2021, 'Engineering', 'Munich', 'Germany', 'BMW', 'Automotive', 'Electrical Systems Engineer', 'https://linkedin.com/in/hugogirard', 'Developing next-generation electric vehicle battery systems.'),
  ('Inès', 'Roux', 'ines.roux@example.com', 2023, 'Data Science', 'Paris', 'France', 'Dataiku', 'Technology', 'Data Scientist', 'https://linkedin.com/in/inesroux', 'Applying machine learning to solve business challenges in retail.'),
  ('Mathieu', 'Lambert', 'mathieu.lambert@example.com', 2022, 'Finance', 'Paris', 'France', 'Crédit Agricole', 'Finance', 'Corporate Banking Associate', 'https://linkedin.com/in/mathieulambert', 'Specialized in financing solutions for SMEs in the tech sector.'),
  
  -- Additional 90 alumni
  ('Julien', 'Robert', 'julien.robert@example.com', 2020, 'Finance', 'Paris', 'France', 'Natixis', 'Finance', 'Equity Trader', 'https://linkedin.com/in/julienrobert', 'Specializing in algorithmic trading strategies and market analysis.'),
  ('Camille', 'Dupont', 'camille.dupont@example.com', 2021, 'Marketing', 'Lyon', 'France', 'Danone', 'Consumer Goods', 'Brand Manager', 'https://linkedin.com/in/camilledupont', 'Developing brand strategies for sustainable food products.'),
  ('Alexandre', 'Simon', 'alexandre.simon@example.com', 2022, 'Computer Science', 'Paris', 'France', 'Ubisoft', 'Gaming', 'Game Developer', 'https://linkedin.com/in/alexandresimon', 'Creating immersive gaming experiences through innovative programming.'),
  ('Marie', 'Lefebvre', 'marie.lefebvre@example.com', 2023, 'Psychology', 'Bordeaux', 'France', 'CHU Bordeaux', 'Healthcare', 'Clinical Psychologist', 'https://linkedin.com/in/marielefebvre', 'Helping adolescents navigate mental health challenges in the digital age.'),
  ('Louis', 'Michel', 'louis.michel@example.com', 2019, 'Mechanical Engineering', 'Toulouse', 'France', 'Airbus', 'Aerospace', 'Systems Engineer', 'https://linkedin.com/in/louismichel', 'Working on next-generation aircraft propulsion systems.'),
  ('Léna', 'Moreau', 'lena.moreau@example.com', 2022, 'International Business', 'Madrid', 'Spain', 'Santander', 'Banking', 'International Relations Officer', 'https://linkedin.com/in/lenamoreau', 'Facilitating business relationships between European and Latin American markets.'),
  ('Nicolas', 'Durand', 'nicolas.durand@example.com', 2021, 'Sustainable Development', 'Marseille', 'France', 'Suez', 'Environment', 'Sustainability Consultant', 'https://linkedin.com/in/nicolasdurand', 'Developing water conservation strategies for Mediterranean cities.'),
  ('Élodie', 'Garnier', 'elodie.garnier@example.com', 2020, 'Fine Arts', 'Berlin', 'Germany', 'Deutsche Museum', 'Arts & Culture', 'Exhibition Curator', 'https://linkedin.com/in/elodiegarnier', 'Curating exhibitions that explore the intersection of art and technology.'),
  ('Antoine', 'Blanc', 'antoine.blanc@example.com', 2023, 'Data Science', 'Amsterdam', 'Netherlands', 'Booking.com', 'Technology', 'Machine Learning Engineer', 'https://linkedin.com/in/antoineblanc', 'Optimizing recommendation algorithms for travel experiences.'),
  ('Clara', 'Morel', 'clara.morel@example.com', 2022, 'Fashion Design', 'Milan', 'Italy', 'Gucci', 'Fashion', 'Junior Designer', 'https://linkedin.com/in/claramorel', 'Creating sustainable luxury fashion with innovative materials.'),
  ('Maxime', 'Faure', 'maxime.faure@example.com', 2021, 'Economics', 'Paris', 'France', 'Rothschild & Co', 'Finance', 'M&A Analyst', 'https://linkedin.com/in/maximefaure', 'Advising on cross-border mergers and acquisitions in the tech sector.'),
  ('Audrey', 'Rousseau', 'audrey.rousseau@example.com', 2020, 'Biology', 'Montpellier', 'France', 'Sanofi', 'Pharmaceuticals', 'Research Scientist', 'https://linkedin.com/in/audreyrousseau', 'Researching novel treatments for autoimmune diseases.'),
  ('Victor', 'Lemoine', 'victor.lemoine@example.com', 2022, 'Political Science', 'Brussels', 'Belgium', 'European Parliament', 'Government', 'Policy Advisor', 'https://linkedin.com/in/victorlemoine', 'Working on EU digital policy and data protection regulations.'),
  ('Julie', 'Boucher', 'julie.boucher@example.com', 2023, 'Architecture', 'Barcelona', 'Spain', 'BCA Architects', 'Architecture', 'Junior Architect', 'https://linkedin.com/in/julieboucher', 'Designing sustainable urban housing solutions for Mediterranean cities.'),
  ('Théo', 'Leclercq', 'theo.leclercq@example.com', 2019, 'Physics', 'Geneva', 'Switzerland', 'CERN', 'Research', 'Research Physicist', 'https://linkedin.com/in/theoleclercq', 'Conducting research on particle physics and quantum mechanics.'),
  ('Manon', 'Bertrand', 'manon.bertrand@example.com', 2022, 'Marketing', 'London', 'United Kingdom', 'Unilever', 'Consumer Goods', 'Digital Marketing Manager', 'https://linkedin.com/in/manonbertrand', 'Leading digital marketing strategies for sustainable personal care products.'),
  ('Paul', 'Roussel', 'paul.roussel@example.com', 2021, 'Computer Engineering', 'Berlin', 'Germany', 'SAP', 'Technology', 'Software Architect', 'https://linkedin.com/in/paulroussel', 'Designing enterprise software solutions for sustainability management.'),
  ('Anaïs', 'Mercier', 'anais.mercier@example.com', 2020, 'Finance', 'Zurich', 'Switzerland', 'UBS', 'Finance', 'Wealth Management Advisor', 'https://linkedin.com/in/anaismercier', 'Specializing in sustainable investment strategies for high-net-worth individuals.'),
  ('Romain', 'Marchand', 'romain.marchand@example.com', 2022, 'Engineering', 'Stockholm', 'Sweden', 'Spotify', 'Technology', 'Audio Engineer', 'https://linkedin.com/in/romainmarchand', 'Developing audio processing algorithms for music streaming.'),
  ('Sarah', 'Vincent', 'sarah.vincent@example.com', 2023, 'Journalism', 'Paris', 'France', 'Le Monde', 'Media', 'Investigative Journalist', 'https://linkedin.com/in/sarahvincent', 'Covering environmental and climate issues across Europe.'),
  ('Gabriel', 'Leroux', 'gabriel.leroux@example.com', 2021, 'Finance', 'Luxembourg', 'Luxembourg', 'PwC', 'Consulting', 'Financial Auditor', 'https://linkedin.com/in/gabrielleroux', 'Auditing fintech and cryptocurrency organizations.'),
  ('Chloé', 'Gaillard', 'chloe.gaillard@example.com', 2020, 'International Law', 'The Hague', 'Netherlands', 'International Court of Justice', 'Legal', 'Legal Assistant', 'https://linkedin.com/in/chloegaillard', 'Working on cases related to international environmental law.'),
  ('Quentin', 'Renard', 'quentin.renard@example.com', 2022, 'Computer Science', 'Paris', 'France', 'Criteo', 'Technology', 'Machine Learning Engineer', 'https://linkedin.com/in/quentinrenard', 'Building recommendation systems for e-commerce.'),
  ('Justine', 'Giraud', 'justine.giraud@example.com', 2019, 'Business', 'Lyon', 'France', 'Renault', 'Automotive', 'Supply Chain Manager', 'https://linkedin.com/in/justinegiraud', 'Optimizing sustainable supply chains for electric vehicle components.'),
  ('Valentin', 'Perrin', 'valentin.perrin@example.com', 2023, 'Music Production', 'Berlin', 'Germany', 'Universal Music', 'Entertainment', 'Sound Engineer', 'https://linkedin.com/in/valentinperrin', 'Recording and producing electronic music artists.'),
  ('Margaux', 'Caron', 'margaux.caron@example.com', 2021, 'Design', 'Copenhagen', 'Denmark', 'Bang & Olufsen', 'Consumer Electronics', 'Product Designer', 'https://linkedin.com/in/margauxcaron', 'Creating minimalist and sustainable audio product designs.'),
  ('Simon', 'Masson', 'simon.masson@example.com', 2022, 'Cybersecurity', 'Paris', 'France', 'Thales', 'Defense & Security', 'Security Analyst', 'https://linkedin.com/in/simonmasson', 'Developing security protocols for critical infrastructure.'),
  ('Élise', 'Gautier', 'elise.gautier@example.com', 2020, 'Environmental Science', 'Montpellier', 'France', 'INRAE', 'Research', 'Environmental Researcher', 'https://linkedin.com/in/elisegautier', 'Studying climate change impacts on Mediterranean ecosystems.'),
  ('Benjamin', 'Legrand', 'benjamin.legrand@example.com', 2022, 'Finance', 'Geneva', 'Switzerland', 'Lombard Odier', 'Finance', 'ESG Analyst', 'https://linkedin.com/in/benjaminlegrand', 'Evaluating corporate environmental and social governance performance.'),
  ('Lucie', 'Robin', 'lucie.robin@example.com', 2023, 'Digital Marketing', 'Dublin', 'Ireland', 'Google', 'Technology', 'Marketing Specialist', 'https://linkedin.com/in/lucierobin', 'Managing digital advertising campaigns for sustainable brands.'),
  ('Arthur', 'David', 'arthur.david@example.com', 2021, 'Industrial Design', 'Milan', 'Italy', 'Ferrari', 'Automotive', 'Interior Designer', 'https://linkedin.com/in/arthurdavid', 'Designing luxury car interiors with sustainable materials.'),
  ('Marine', 'Fontaine', 'marine.fontaine@example.com', 2020, 'Hospitality Management', 'Barcelona', 'Spain', 'Four Seasons', 'Hospitality', 'Guest Relations Manager', 'https://linkedin.com/in/marinefontaine', 'Creating exceptional experiences for luxury hotel guests.'),
  ('Adrien', 'Leroy', 'adrien.leroy@example.com', 2022, 'Aerospace Engineering', 'Toulouse', 'France', 'Airbus', 'Aerospace', 'Propulsion Engineer', 'https://linkedin.com/in/adrienleroy', 'Developing sustainable aviation fuel technologies.'),
  ('Pauline', 'Guerin', 'pauline.guerin@example.com', 2021, 'Neuroscience', 'Lausanne', 'Switzerland', 'EPFL', 'Research', 'Neuroscience Researcher', 'https://linkedin.com/in/paulineguerin', 'Studying cognitive processes and brain-computer interfaces.'),
  ('Mathis', 'Fabre', 'mathis.fabre@example.com', 2023, 'Data Science', 'Munich', 'Germany', 'Siemens', 'Technology', 'Data Engineer', 'https://linkedin.com/in/mathisfabre', 'Building data pipelines for industrial IoT applications.'),
  ('Céline', 'Brunet', 'celine.brunet@example.com', 2020, 'Medicine', 'Paris', 'France', 'Hôpital Necker', 'Healthcare', 'Pediatric Resident', 'https://linkedin.com/in/celinebrunet', 'Specializing in pediatric oncology treatments.'),
  ('Loïc', 'Barbier', 'loic.barbier@example.com', 2022, 'Renewable Energy', 'Madrid', 'Spain', 'Iberdrola', 'Energy', 'Solar Project Manager', 'https://linkedin.com/in/loicbarbier', 'Managing large-scale solar energy installations across Southern Europe.'),
  ('Sophie', 'Berger', 'sophie.berger@example.com', 2021, 'Psychology', 'Vienna', 'Austria', 'University of Vienna', 'Education', 'Research Psychologist', 'https://linkedin.com/in/sophieberger', 'Researching workplace well-being and mental health.'),
  ('David', 'Meunier', 'david.meunier@example.com', 2020, 'Finance', 'London', 'United Kingdom', 'Goldman Sachs', 'Finance', 'Investment Analyst', 'https://linkedin.com/in/davidmeunier', 'Analyzing investment opportunities in renewable energy.'),
  ('Émilie', 'Perrier', 'emilie.perrier@example.com', 2022, 'Biotechnology', 'Basel', 'Switzerland', 'Roche', 'Pharmaceuticals', 'Research Scientist', 'https://linkedin.com/in/emilieperrier', 'Developing personalized medicine approaches for cancer treatment.'),
  ('Thomas', 'Rey', 'thomas.rey@example.com', 2023, 'Artificial Intelligence', 'Amsterdam', 'Netherlands', 'Adyen', 'Fintech', 'AI Developer', 'https://linkedin.com/in/thomasrey', 'Building fraud detection systems using machine learning.'),
  ('Laura', 'Colin', 'laura.colin@example.com', 2019, 'International Relations', 'Brussels', 'Belgium', 'NATO', 'Government', 'Policy Analyst', 'https://linkedin.com/in/lauracolin', 'Analyzing cybersecurity policies and international cooperation.'),
  ('Guillaume', 'Brun', 'guillaume.brun@example.com', 2022, 'Finance', 'Paris', 'France', 'Lazard', 'Finance', 'Financial Advisor', 'https://linkedin.com/in/guillaumebrun', 'Advising on mergers and acquisitions in the technology sector.'),
  ('Charlotte', 'Martel', 'charlotte.martel@example.com', 2021, 'Fashion Business', 'Milan', 'Italy', 'Prada', 'Fashion', 'Merchandising Associate', 'https://linkedin.com/in/charlottemartel', 'Developing sustainable merchandising strategies for luxury fashion.'),
  ('Maxence', 'Roy', 'maxence.roy@example.com', 2020, 'Computer Science', 'Helsinki', 'Finland', 'Nokia', 'Technology', 'Network Engineer', 'https://linkedin.com/in/maxenceroy', 'Working on 5G network optimization and deployment.'),
  ('Amandine', 'Arnaud', 'amandine.arnaud@example.com', 2022, 'Environmental Management', 'Copenhagen', 'Denmark', 'Vestas', 'Energy', 'Sustainability Manager', 'https://linkedin.com/in/amandinearnaud', 'Managing environmental impact assessments for wind farm projects.'),
  ('Clément', 'Bourgeois', 'clement.bourgeois@example.com', 2023, 'Robotics', 'Zurich', 'Switzerland', 'ABB', 'Industrial', 'Robotics Engineer', 'https://linkedin.com/in/clementbourgeois', 'Designing collaborative robots for manufacturing.'),
  ('Agathe', 'Leclerc', 'agathe.leclerc@example.com', 2021, 'Urban Planning', 'Barcelona', 'Spain', 'Barcelona City Council', 'Government', 'Urban Designer', 'https://linkedin.com/in/agatheleclerc', 'Planning sustainable urban spaces and mobility solutions.'),
  ('Bastien', 'Bonnet', 'bastien.bonnet@example.com', 2020, 'Finance', 'Luxembourg', 'Luxembourg', 'European Investment Bank', 'Finance', 'Investment Officer', 'https://linkedin.com/in/bastienbonnet', 'Financing sustainable development projects across Europe.'),
  ('Océane', 'Hubert', 'oceane.hubert@example.com', 2022, 'Marine Biology', 'Marseille', 'France', 'Ifremer', 'Research', 'Marine Biologist', 'https://linkedin.com/in/oceanehubert', 'Studying Mediterranean marine ecosystems and conservation.'),
  ('Nathan', 'Fernandez', 'nathan.fernandez@example.com', 2021, 'Marketing', 'Madrid', 'Spain', 'Telefónica', 'Telecommunications', 'Product Marketing Manager', 'https://linkedin.com/in/nathanfernandez', 'Developing marketing strategies for IoT products.'),
  ('Zoé', 'Lucas', 'zoe.lucas@example.com', 2020, 'Fine Arts', 'Rome', 'Italy', 'Galleria Borghese', 'Arts & Culture', 'Art Conservator', 'https://linkedin.com/in/zoelucas', 'Specializing in the restoration of Renaissance paintings.'),
  ('Raphaël', 'Dumas', 'raphael.dumas@example.com', 2022, 'Civil Engineering', 'Rotterdam', 'Netherlands', 'Van Oord', 'Construction', 'Structural Engineer', 'https://linkedin.com/in/raphaeldumas', 'Working on sustainable harbor infrastructure projects.'),
  ('Manon', 'Dupuis', 'manon.dupuis@example.com', 2021, 'Data Science', 'London', 'United Kingdom', 'DeepMind', 'Technology', 'Research Scientist', 'https://linkedin.com/in/manondupuis', 'Developing AI solutions for climate change modeling.'),
  ('Thibault', 'Carre', 'thibault.carre@example.com', 2023, 'International Business', 'Singapore', 'Singapore', 'DBS Bank', 'Finance', 'Business Analyst', 'https://linkedin.com/in/thibaultcarre', 'Analyzing market opportunities in Southeast Asian sustainable finance.'),
  ('Inès', 'Germain', 'ines.germain@example.com', 2020, 'Medicine', 'Lyon', 'France', 'Centre Léon Bérard', 'Healthcare', 'Oncology Resident', 'https://linkedin.com/in/inesgermain', 'Researching immunotherapy approaches for cancer treatment.'),
  ('Lucas', 'Chartier', 'lucas.chartier@example.com', 2022, 'Graphic Design', 'Berlin', 'Germany', 'Zalando', 'E-commerce', 'UX Designer', 'https://linkedin.com/in/lucaschartier', 'Creating user-centered experiences for online fashion retail.'),
  ('Eva', 'Rolland', 'eva.rolland@example.com', 2021, 'Journalism', 'Brussels', 'Belgium', 'Euronews', 'Media', 'Political Correspondent', 'https://linkedin.com/in/evarolland', 'Covering EU politics and environmental policy.'),
  ('Alexis', 'Jacquet', 'alexis.jacquet@example.com', 2020, 'Engineering', 'Stockholm', 'Sweden', 'Ericsson', 'Technology', 'Network Architect', 'https://linkedin.com/in/alexisjacquet', 'Designing sustainable 5G network infrastructure.'),
  ('Noémie', 'Guyot', 'noemie.guyot@example.com', 2022, 'Psychology', 'Geneva', 'Switzerland', 'World Health Organization', 'International Organizations', 'Mental Health Specialist', 'https://linkedin.com/in/noemieguyot', 'Developing mental health programs for refugee populations.'),
  ('Léo', 'Legros', 'leo.legros@example.com', 2023, 'Software Engineering', 'Paris', 'France', 'Dassault Systèmes', 'Technology', 'DevOps Engineer', 'https://linkedin.com/in/leolegros', 'Implementing continuous integration pipelines for 3D modeling software.'),
  ('Anaïs', 'Mallet', 'anais.mallet@example.com', 2021, 'Luxury Management', 'London', 'United Kingdom', 'Burberry', 'Fashion', 'Brand Strategist', 'https://linkedin.com/in/anaismallet', 'Developing sustainability strategies for luxury fashion brands.'),
  ('Julien', 'Marty', 'julien.marty@example.com', 2020, 'Finance', 'Paris', 'France', 'Rothschild & Co', 'Finance', 'Private Equity Associate', 'https://linkedin.com/in/julienmarty', 'Identifying investment opportunities in European tech startups.'),
  ('Chloé', 'Gaudin', 'chloe.gaudin@example.com', 2022, 'Computer Science', 'Dublin', 'Ireland', 'Stripe', 'Fintech', 'Software Engineer', 'https://linkedin.com/in/chloegaudin', 'Building payment infrastructure for the digital economy.'),
  ('Maxime', 'Boulay', 'maxime.boulay@example.com', 2021, 'Agronomics', 'Wageningen', 'Netherlands', 'Wageningen University', 'Research', 'Agricultural Scientist', 'https://linkedin.com/in/maximeboulay', 'Researching sustainable farming practices and food security.'),
  ('Alice', 'Gillet', 'alice.gillet@example.com', 2020, 'Design', 'Copenhagen', 'Denmark', 'IKEA', 'Retail', 'Product Designer', 'https://linkedin.com/in/alicegillet', 'Designing sustainable furniture and home accessories.'),
  ('Valentin', 'Tessier', 'valentin.tessier@example.com', 2022, 'Law', 'Frankfurt', 'Germany', 'Freshfields', 'Legal', 'Corporate Lawyer', 'https://linkedin.com/in/valentintessier', 'Specializing in renewable energy project financing and regulations.'),
  ('Ambre', 'Barthelemy', 'ambre.barthelemy@example.com', 2023, 'Digital Communication', 'Paris', 'France', 'Publicis', 'Advertising', 'Content Strategist', 'https://linkedin.com/in/ambrebarthelemy', 'Creating digital content strategies for luxury brands.'),
  ('Mathieu', 'Renault', 'mathieu.renault@example.com', 2019, 'Mechanical Engineering', 'Stuttgart', 'Germany', 'Bosch', 'Manufacturing', 'Automation Engineer', 'https://linkedin.com/in/mathieurenault', 'Developing autonomous systems for industrial applications.'),
  ('Camille', 'Herve', 'camille.herve@example.com', 2022, 'International Relations', 'New York', 'United States', 'United Nations', 'International Organizations', 'Climate Policy Analyst', 'https://linkedin.com/in/camilleherve', 'Working on international climate agreement implementation.'),
  ('Sébastien', 'Marques', 'sebastien.marques@example.com', 2021, 'Finance', 'Madrid', 'Spain', 'BBVA', 'Banking', 'Sustainable Finance Specialist', 'https://linkedin.com/in/sebastienmarques', 'Developing green financial products and sustainability ratings.'),
  ('Marie', 'Philippe', 'marie.philippe@example.com', 2020, 'Art History', 'Paris', 'France', 'Musée d''Orsay', 'Arts & Culture', 'Exhibition Manager', 'https://linkedin.com/in/mariephilippe', 'Curating impressionist and post-impressionist art exhibitions.'),
  ('Robin', 'Pichon', 'robin.pichon@example.com', 2022, 'Computer Engineering', 'Tallinn', 'Estonia', 'Skype', 'Technology', 'Backend Developer', 'https://linkedin.com/in/robinpichon', 'Building secure and scalable communication infrastructure.'),
  ('Juliette', 'Marin', 'juliette.marin@example.com', 2021, 'Environmental Science', 'Oslo', 'Norway', 'Norwegian Environment Agency', 'Government', 'Climate Researcher', 'https://linkedin.com/in/juliettemarin', 'Monitoring and analyzing Arctic climate change data.'),
  ('Quentin', 'Barbe', 'quentin.barbe@example.com', 2023, 'Business Administration', 'Zurich', 'Switzerland', 'Nestlé', 'Consumer Goods', 'Sustainability Manager', 'https://linkedin.com/in/quentinbarbe', 'Implementing sustainable packaging initiatives across product lines.'),
  ('Marion', 'Royer', 'marion.royer@example.com', 2020, 'Neuroscience', 'Cambridge', 'United Kingdom', 'University of Cambridge', 'Research', 'Neuroscience Researcher', 'https://linkedin.com/in/marionroyer', 'Studying cognitive processes in learning and memory formation.'),
  ('Nicolas', 'Peltier', 'nicolas.peltier@example.com', 2022, 'Finance', 'Paris', 'France', 'Ardian', 'Finance', 'Private Equity Analyst', 'https://linkedin.com/in/nicolaspeltier', 'Evaluating investment opportunities in renewable energy infrastructure.'),
('Caroline', 'Lacroix', 'caroline.lacroix@example.com', 2021, 'Marketing', 'Vienna', 'Austria', 'Red Bull', 'Consumer Goods', 'Brand Manager', 'https://linkedin.com/in/carolinelacroix', 'Managing marketing campaigns for energy drinks in Central Europe.'),
  ('Alexandre', 'Cordier', 'alexandre.cordier@example.com', 2020, 'Computer Science', 'Lisbon', 'Portugal', 'Farfetch', 'E-commerce', 'Software Architect', 'https://linkedin.com/in/alexandrecordier', 'Designing e-commerce platforms for luxury fashion retailers.'),
  ('Éloïse', 'Besson', 'eloise.besson@example.com', 2022, 'Political Science', 'Berlin', 'Germany', 'German Parliament', 'Government', 'Political Analyst', 'https://linkedin.com/in/eloisebesson', 'Analyzing Franco-German relations and EU policy.'),
  ('Aurélien', 'Delaunay', 'aurelien.delaunay@example.com', 2019, 'Aerospace Engineering', 'Toulouse', 'France', 'Thales Alenia Space', 'Aerospace', 'Satellite Engineer', 'https://linkedin.com/in/aureliendelaunay', 'Developing satellite technologies for Earth observation.'),
  ('Mélanie', 'Monnier', 'melanie.monnier@example.com', 2023, 'Digital Marketing', 'Barcelona', 'Spain', 'CaixaBank', 'Banking', 'Digital Marketing Specialist', 'https://linkedin.com/in/melaniemonnier', 'Creating digital campaigns for financial services.'),
  ('Florian', 'Carlier', 'florian.carlier@example.com', 2022, 'Food Science', 'Paris', 'France', 'Danone', 'Food & Beverage', 'R&D Scientist', 'https://linkedin.com/in/floriancarlier', 'Developing plant-based alternatives to dairy products.'),
  ('Émilie', 'Bouchet', 'emilie.bouchet@example.com', 2021, 'Architecture', 'Stockholm', 'Sweden', 'White Arkitekter', 'Architecture', 'Sustainable Architect', 'https://linkedin.com/in/emiliebouchet', 'Designing carbon-neutral buildings and urban environments.'),
  ('Théo', 'Guillon', 'theo.guillon@example.com', 2020, 'Finance', 'London', 'United Kingdom', 'Barclays', 'Finance', 'Risk Analyst', 'https://linkedin.com/in/theoguillon', 'Evaluating climate-related financial risks for investment portfolios.'),
  ('Lisa', 'Gonzalez', 'lisa.gonzalez@example.com', 2022, 'International Business', 'Milan', 'Italy', 'Lavazza', 'Food & Beverage', 'Export Manager', 'https://linkedin.com/in/lisagonzalez', 'Managing coffee exports to sustainable markets worldwide.'),
  ('Anthony', 'Meunier', 'anthony.meunier@example.com', 2023, 'Computer Science', 'Paris', 'France', 'Doctolib', 'Healthcare Technology', 'Full-Stack Developer', 'https://linkedin.com/in/anthonymeunier', 'Building telemedicine platforms for healthcare access.'),
  ('Mathilde', 'Collet', 'mathilde.collet@example.com', 2021, 'Biochemistry', 'Cambridge', 'United Kingdom', 'AstraZeneca', 'Pharmaceuticals', 'Biochemistry Researcher', 'https://linkedin.com/in/mathildecollet', 'Researching mRNA vaccine technologies for infectious diseases.'),
  ('Vincent', 'Hoarau', 'vincent.hoarau@example.com', 2020, 'Supply Chain Management', 'Rotterdam', 'Netherlands', 'Unilever', 'Consumer Goods', 'Supply Chain Analyst', 'https://linkedin.com/in/vincenthoarau', 'Optimizing sustainable supply chains for consumer products.'),
  ('Clémence', 'Navarro', 'clemence.navarro@example.com', 2022, 'Renewable Energy', 'Madrid', 'Spain', 'Iberdrola', 'Energy', 'Wind Energy Specialist', 'https://linkedin.com/in/clemencenavarro', 'Managing offshore wind farm development projects.'),
  ('Fabien', 'Tournier', 'fabien.tournier@example.com', 2021, 'Finance', 'Frankfurt', 'Germany', 'Deutsche Bank', 'Finance', 'Sustainable Finance Analyst', 'https://linkedin.com/in/fabientournier', 'Evaluating green bonds and sustainable investment products.'),
  ('Diane', 'Albert', 'diane.albert@example.com', 2020, 'Nutrition Science', 'Copenhagen', 'Denmark', 'Arla Foods', 'Food & Beverage', 'Nutrition Researcher', 'https://linkedin.com/in/dianealbert', 'Developing nutritional guidelines for sustainable dairy products.'),
  ('Guillaume', 'Vallet', 'guillaume.vallet@example.com', 2022, 'Information Security', 'Luxembourg', 'Luxembourg', 'European Investment Bank', 'Finance', 'Cybersecurity Expert', 'https://linkedin.com/in/guillaumevallet', 'Implementing security protocols for financial institutions.'),
  ('Cassandra', 'Mahe', 'cassandra.mahe@example.com', 2023, 'Fashion Design', 'Paris', 'France', 'Chanel', 'Fashion', 'Assistant Designer', 'https://linkedin.com/in/cassandramahe', 'Creating sustainable luxury fashion collections.'),
  ('Romain', 'Gilbert', 'romain.gilbert@example.com', 2019, 'Electrical Engineering', 'Lyon', 'France', 'Schneider Electric', 'Energy', 'Power Systems Engineer', 'https://linkedin.com/in/romaingilbert', 'Designing smart grid solutions for renewable energy integration.')
ON CONFLICT (email) DO NOTHING;

-- Create function for searching alumni with full text search
CREATE OR REPLACE FUNCTION search_alumni(
  search_term TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL,
  industry_filter TEXT DEFAULT NULL,
  graduation_year_filter INTEGER DEFAULT NULL,
  program_filter TEXT DEFAULT NULL,
  company_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS SETOF alumni AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM alumni
  WHERE
    (search_term IS NULL OR 
     to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(city, '') || ' ' || 
                COALESCE(industry, '') || ' ' || COALESCE(program, '') || ' ' || COALESCE(company, '')) 
     @@ to_tsquery('english', search_term))
    AND (city_filter IS NULL OR city ILIKE '%' || city_filter || '%')
    AND (industry_filter IS NULL OR industry ILIKE '%' || industry_filter || '%')
    AND (graduation_year_filter IS NULL OR graduation_year = graduation_year_filter)
    AND (program_filter IS NULL OR program ILIKE '%' || program_filter || '%')
    AND (company_filter IS NULL OR company ILIKE '%' || company_filter || '%')
  ORDER BY last_name, first_name
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Get random alumni function
CREATE OR REPLACE FUNCTION get_random_alumni(count_param INTEGER DEFAULT 2)
RETURNS SETOF alumni AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM alumni
  ORDER BY random()
  LIMIT count_param;
END;
$$ LANGUAGE plpgsql;

-- Grant privileges (adjust as needed for your environment)
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous access (read-only)
DROP POLICY IF EXISTS alumni_anon_select ON alumni;
CREATE POLICY alumni_anon_select ON alumni 
  FOR SELECT TO anon
  USING (true);

-- Policy for authenticated users (can see all)
DROP POLICY IF EXISTS alumni_auth_select ON alumni;
CREATE POLICY alumni_auth_select ON alumni 
  FOR SELECT TO authenticated
  USING (true);

-- Create index for text search
CREATE INDEX IF NOT EXISTS idx_alumni_text_search ON alumni USING GIN (to_tsvector('english', 
  coalesce(first_name, '') || ' ' || 
  coalesce(last_name, '') || ' ' || 
  coalesce(city, '') || ' ' || 
  coalesce(industry, '') || ' ' || 
  coalesce(program, '') || ' ' || 
  coalesce(company, '')
));