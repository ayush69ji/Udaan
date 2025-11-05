import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

// --- Sample Users ---
const studentsData = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.com',
    password: 'student123',
    role: 'student',
    profile: {
      enrollmentNumber: 'STU001',
      branch: 'Computer Science',
      semester: 6,
      cgpa: 8.5,
      phone: '9876543210'
    }
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@student.com',
    password: 'student123',
    role: 'student',
    profile: {
      enrollmentNumber: 'STU002',
      branch: 'Information Technology',
      semester: 4,
      cgpa: 9.1,
      phone: '9876543211'
    }
  },
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@student.com',
    password: 'student123',
    role: 'student',
    profile: {
      enrollmentNumber: 'STU003',
      branch: 'Electronics',
      semester: 6,
      cgpa: 7.8,
      phone: '9876543212'
    }
  }
];

const adminsData = [
  {
    name: 'Dr. Rajesh Verma',
    email: 'admin@udaan.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      department: 'Administration',
      phone: '9876543220'
    }
  }
];

const recruitersData = [
  {
    name: 'Sundar Pichai',
    email: 'hr@google.com',
    password: 'recruiter123',
    role: 'recruiter',
    profile: {
      companyName: 'Google India',
      designation: 'HR Manager',
      phone: '9876543230',
      companyWebsite: 'https://careers.google.com',
      industry: 'Technology',
      companySize: '10000+'
    }
  },
  {
    name: 'Neha Kapoor',
    email: 'talent@flipkart.com',
    password: 'recruiter123',
    role: 'recruiter',
    profile: {
      companyName: 'Flipkart',
      designation: 'HR Business Partner',
      phone: '9876543234',
      companyWebsite: 'https://www.flipkartcareers.com',
      industry: 'E-commerce',
      companySize: '5000-10000'
    }
  }
];

// --- Helper: Hash Password ---
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// --- Main Seeding Function ---
const seedDatabase = async () => {
  try {
    // ✅ Use MONGO_URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all data
    await Promise.all([User.deleteMany({}), Job.deleteMany({}), Application.deleteMany({})]);
    console.log('🗑️  Cleared existing collections');

    // Combine and hash users
    const allUsers = [...studentsData, ...adminsData, ...recruitersData];
    const usersWithHashedPasswords = await Promise.all(
      allUsers.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password)
      }))
    );

    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Create Jobs for Recruiters
    const recruiter1 = insertedUsers.find((u) => u.email === 'hr@google.com');
    const recruiter2 = insertedUsers.find((u) => u.email === 'talent@flipkart.com');

    const jobsData = [
      {
        company: 'Google India',
        title: 'Software Engineer Intern',
        description: 'Work on Google-scale systems and help build scalable web services.',
        eligibility: 'B.Tech (CS/IT) with CGPA 8.0+',
        lastDate: '2025-12-31',
        recruiterId: recruiter1._id,
        status: 'active'
      },
      {
        company: 'Flipkart',
        title: 'Frontend Developer',
        description: 'Develop modern web UIs using React and TypeScript.',
        eligibility: 'B.Tech (CS/IT) with CGPA 7.5+',
        lastDate: '2025-11-30',
        recruiterId: recruiter2._id,
        status: 'active'
      }
    ];

    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`✅ Inserted ${insertedJobs.length} jobs`);

    // Create Applications (students applying to jobs)
    const student1 = insertedUsers.find((u) => u.email === 'rahul.sharma@student.com');
    const student2 = insertedUsers.find((u) => u.email === 'priya.patel@student.com');

    const applicationsData = [
      {
        jobId: insertedJobs[0]._id,
        studentId: student1._id,
        status: 'pending'
      },
      {
        jobId: insertedJobs[1]._id,
        studentId: student2._id,
        status: 'pending'
      }
    ];

    const insertedApplications = await Application.insertMany(applicationsData);
    console.log(`✅ Inserted ${insertedApplications.length} applications`);

    // Summary
    console.log('\n📊 Summary:');
    console.log(`Users: ${insertedUsers.length}`);
    console.log(`Jobs: ${insertedJobs.length}`);
    console.log(`Applications: ${insertedApplications.length}`);
    console.log('═════════════════════════════════════════════');

    console.log('\n🔐 Login Credentials:');
    console.log('--- Students ---');
    studentsData.forEach(u => console.log(`Email: ${u.email} | Password: student123`));
    console.log('\n--- Admins ---');
    adminsData.forEach(u => console.log(`Email: ${u.email} | Password: admin123`));
    console.log('\n--- Recruiters ---');
    recruitersData.forEach(u => console.log(`Email: ${u.email} | Password: recruiter123`));

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
