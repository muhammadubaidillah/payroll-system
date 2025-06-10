const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { query } = require('./libs/pgsql');

const SALT_ROUNDS = 10;

async function populateUsers() {
  const now = new Date();

  // WARNING: Hardcoded dummy passwords. Intended ONLY for development/seeding. DO NOT use in production.
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const employeePassword = await bcrypt.hash('employee123', SALT_ROUNDS);

  try {
    // 1. Insert Admin
    const adminId = uuidv4();
    await query(
      `INSERT INTO users (id, username, password, role, full_name, created_at, updated_at)
         VALUES ($1, $2, $3, 'admin', $4, $5, $5)`,
      [adminId, 'admin', adminPassword, 'System Admin', now]
    );

    // 2. Insert Employees
    for (let i = 1; i <= 100; i++) {
      const id = uuidv4();
      const username = `employee${i}`;
      const fullName = faker.person.fullName();
      const salary = faker.number.int({ min: 3000000, max: 10000000 });

      await query(
        `INSERT INTO users (id, username, password, role, salary, full_name, created_at, updated_at)
           VALUES ($1, $2, $3, 'employee', $4, $5, $6, $6)`,
        [id, username, employeePassword, salary, fullName, now]
      );
    }

    console.log('✅ Seeder complete!');
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

populateUsers();
