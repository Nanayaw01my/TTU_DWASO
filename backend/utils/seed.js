require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Region = require('../models/Region');
const User = require('../models/User');

const regionsData = [
  {
    name: 'Greater Accra Region',
    code: 'GAR',
    institutions: [
      { name: 'University of Ghana, Legon', type: 'UNIVERSITY' },
      { name: 'Ghana Institute of Management and Public Administration (GIMPA)', type: 'UNIVERSITY' },
      { name: 'University of Professional Studies, Accra (UPSA)', type: 'UNIVERSITY' },
      { name: 'Accra Technical University', type: 'UNIVERSITY' },
      { name: 'Ghana Communication Technology University (GCTU)', type: 'UNIVERSITY' },
      { name: 'Lancaster University Ghana', type: 'UNIVERSITY' },
      { name: 'Zenith University College', type: 'UNIVERSITY' },
      { name: 'Regent University College of Science and Technology', type: 'UNIVERSITY' },
      { name: 'Accra College of Education', type: 'TEACHER' },
      { name: 'Aburi Girls Senior High Training College', type: 'TEACHER' },
      { name: 'Korle Bu Nursing Training College', type: 'NURSING' },
      { name: 'School of Hygiene, Korle Bu', type: 'NURSING' },
      { name: 'Narh-Bita College', type: 'NURSING' },
      { name: 'Police Hospital Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Ashanti Region',
    code: 'ASH',
    institutions: [
      { name: 'Kwame Nkrumah University of Science and Technology (KNUST)', type: 'UNIVERSITY' },
      { name: 'Kumasi Technical University', type: 'UNIVERSITY' },
      { name: 'University of Education, Winneba - Kumasi Campus', type: 'UNIVERSITY' },
      { name: 'Ashesi University', type: 'UNIVERSITY' },
      { name: 'Valley View University - Kumasi Campus', type: 'UNIVERSITY' },
      { name: 'Kumasi College of Health', type: 'NURSING' },
      { name: 'Suntreso Government Hospital Nursing Training College', type: 'NURSING' },
      { name: 'Okomfo Anokye School of Nursing', type: 'NURSING' },
      { name: 'St. Louis College of Education, Kumasi', type: 'TEACHER' },
      { name: 'Kumasi College of Education', type: 'TEACHER' },
      { name: 'Presbyterian College of Education, Akropong', type: 'TEACHER' },
      { name: 'Offinso College of Education', type: 'TEACHER' },
    ],
  },
  {
    name: 'Western Region',
    code: 'WES',
    institutions: [
      { name: 'University of Mines and Technology (UMaT), Tarkwa', type: 'UNIVERSITY' },
      { name: 'Takoradi Technical University', type: 'UNIVERSITY' },
      { name: 'University of Education, Winneba - Sekondi Campus', type: 'UNIVERSITY' },
      { name: 'Sekondi College', type: 'UNIVERSITY' },
      { name: 'Effia-Nkwanta Regional Hospital Nursing Training College', type: 'NURSING' },
      { name: 'Sekondi Nursing Training College', type: 'NURSING' },
      { name: 'Enchi College of Education', type: 'TEACHER' },
      { name: 'St. Augustine\'s College of Education, Bogoso', type: 'TEACHER' },
    ],
  },
  {
    name: 'Western North Region',
    code: 'WNR',
    institutions: [
      { name: 'Sefwi Wiawso College of Education', type: 'TEACHER' },
      { name: 'Sefwi Wiawso Nursing Training College', type: 'NURSING' },
      { name: 'University of Mines and Technology - Western North Campus', type: 'UNIVERSITY' },
    ],
  },
  {
    name: 'Central Region',
    code: 'CEN',
    institutions: [
      { name: 'University of Cape Coast (UCC)', type: 'UNIVERSITY' },
      { name: 'University of Education, Winneba (UEW)', type: 'UNIVERSITY' },
      { name: 'Cape Coast Technical University', type: 'UNIVERSITY' },
      { name: 'Central University, Miotso', type: 'UNIVERSITY' },
      { name: 'Cape Coast Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'Saltpond Nursing Training College', type: 'NURSING' },
      { name: 'Fante Methodist College of Education', type: 'TEACHER' },
      { name: 'St. Francis College of Education, Hohoe', type: 'TEACHER' },
      { name: 'Abura Dunkwa College of Education', type: 'TEACHER' },
    ],
  },
  {
    name: 'Eastern Region',
    code: 'EAS',
    institutions: [
      { name: 'Koforidua Technical University', type: 'UNIVERSITY' },
      { name: 'University of Energy and Natural Resources - Eastern Campus', type: 'UNIVERSITY' },
      { name: 'All Nations University', type: 'UNIVERSITY' },
      { name: 'Perez University College', type: 'UNIVERSITY' },
      { name: 'Eastern Regional Hospital Nursing Training College', type: 'NURSING' },
      { name: 'Presbyterian Nursing Training College, Agogo', type: 'NURSING' },
      { name: 'Kibi College of Education', type: 'TEACHER' },
      { name: 'Akwatia College of Education', type: 'TEACHER' },
      { name: 'Atibie Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Volta Region',
    code: 'VOL',
    institutions: [
      { name: 'Ho Technical University', type: 'UNIVERSITY' },
      { name: 'University of Health and Allied Sciences (UHAS), Ho', type: 'UNIVERSITY' },
      { name: 'Evangelical Presbyterian University College', type: 'UNIVERSITY' },
      { name: 'Ho Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'Jasikan College of Education', type: 'TEACHER' },
      { name: 'Peki College of Education', type: 'TEACHER' },
      { name: 'Akatsi College of Education', type: 'TEACHER' },
      { name: 'Dambai College of Education', type: 'TEACHER' },
    ],
  },
  {
    name: 'Oti Region',
    code: 'OTI',
    institutions: [
      { name: 'Dambai College of Education', type: 'TEACHER' },
      { name: 'Jasikan District Hospital Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Bono Region',
    code: 'BON',
    institutions: [
      { name: 'University of Energy and Natural Resources (UENR), Sunyani', type: 'UNIVERSITY' },
      { name: 'Sunyani Technical University', type: 'UNIVERSITY' },
      { name: 'Sunyani College of Education', type: 'TEACHER' },
      { name: 'Bechem Government Hospital Nursing Training College', type: 'NURSING' },
      { name: 'Holy Family Nursing and Midwifery Training College, Berekum', type: 'NURSING' },
    ],
  },
  {
    name: 'Bono East Region',
    code: 'BEA',
    institutions: [
      { name: 'Kintampo College of Health', type: 'NURSING' },
      { name: 'Techiman Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'Tano North College of Education', type: 'TEACHER' },
    ],
  },
  {
    name: 'Ahafo Region',
    code: 'AHA',
    institutions: [
      { name: 'Goaso College of Education', type: 'TEACHER' },
      { name: 'Ahafo Ano College', type: 'UNIVERSITY' },
      { name: 'Goaso Government Hospital Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Northern Region',
    code: 'NOR',
    institutions: [
      { name: 'University for Development Studies (UDS), Tamale', type: 'UNIVERSITY' },
      { name: 'Tamale Technical University', type: 'UNIVERSITY' },
      { name: 'C.K. Tedam University of Technology and Applied Sciences', type: 'UNIVERSITY' },
      { name: 'Tamale Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'Tamale Teaching Hospital Nursing Training College', type: 'NURSING' },
      { name: 'Bagabaga College of Education', type: 'TEACHER' },
      { name: 'Tamale College of Education', type: 'TEACHER' },
      { name: 'Nkoranza Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Savannah Region',
    code: 'SAV',
    institutions: [
      { name: 'Damongo College of Education', type: 'TEACHER' },
      { name: 'Damongo Nursing and Midwifery Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'North East Region',
    code: 'NEA',
    institutions: [
      { name: 'Nalerigu Nursing Training College', type: 'NURSING' },
      { name: 'St. John Bosco College of Education, Navrongo', type: 'TEACHER' },
      { name: 'Gambaga College of Education', type: 'TEACHER' },
    ],
  },
  {
    name: 'Upper East Region',
    code: 'UEA',
    institutions: [
      { name: 'University for Development Studies - Navrongo Campus', type: 'UNIVERSITY' },
      { name: 'Bolgatanga Technical University', type: 'UNIVERSITY' },
      { name: 'Bolgatanga Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'War Memorial Hospital Nursing Training College, Navrongo', type: 'NURSING' },
      { name: 'Bawku College of Education', type: 'TEACHER' },
      { name: 'Sandema Nursing Training College', type: 'NURSING' },
    ],
  },
  {
    name: 'Upper West Region',
    code: 'UWE',
    institutions: [
      { name: 'University for Development Studies - Wa Campus', type: 'UNIVERSITY' },
      { name: 'Wa Polytechnic (Wa Technical University)', type: 'UNIVERSITY' },
      { name: 'Wa Nursing and Midwifery Training College', type: 'NURSING' },
      { name: 'Lawra College of Education', type: 'TEACHER' },
      { name: 'Nusrat Jahan Ahmadiyya College of Education', type: 'TEACHER' },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Region.deleteMany({});
    console.log('🗑️  Cleared existing regions');

    // Insert regions
    const regions = await Region.insertMany(regionsData);
    console.log(`✅ Inserted ${regions.length} regions with institutions`);

    // Create admin account
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const garRegion = regions.find((r) => r.code === 'GAR');

      await User.create({
        role: 'admin',
        fullName: 'TTU DWASO Admin',
        email: process.env.ADMIN_EMAIL || 'admin@ttudwaso.edu.gh',
        phone: '+233200000000',
        password: process.env.ADMIN_PASSWORD || 'Admin@TTU2024!',
        region: garRegion._id,
        institution: 'University of Ghana, Legon',
        institutionType: 'UNIVERSITY',
        isApproved: true,
      });

      console.log('✅ Admin account created');
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@ttudwaso.edu.gh'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@TTU2024!'}`);
    } else {
      console.log('ℹ️  Admin account already exists, skipping');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
