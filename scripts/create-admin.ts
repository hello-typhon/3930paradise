import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

const db = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  console.log('\n=== CREATE ADMIN USER ===\n');

  const username = await question('Enter admin username: ');
  if (!username || username.trim().length === 0) {
    console.error('Username cannot be empty');
    process.exit(1);
  }

  // Check if admin already exists
  const existing = await db.admin.findUnique({
    where: { username: username.trim() },
  });

  if (existing) {
    console.error(`Admin user "${username}" already exists!`);
    process.exit(1);
  }

  const password = await question('Enter admin password: ');
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  const passwordConfirm = await question('Confirm password: ');
  if (password !== passwordConfirm) {
    console.error('Passwords do not match!');
    process.exit(1);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await db.admin.create({
    data: {
      username: username.trim(),
      passwordHash,
    },
  });

  console.log(`\n✓ Admin user "${admin.username}" created successfully!`);
  console.log(`\nYou can now login at: http://localhost:3000/admin/login`);

  rl.close();
  await db.$disconnect();
}

createAdmin().catch((error) => {
  console.error('Error creating admin:', error);
  rl.close();
  db.$disconnect();
  process.exit(1);
});
