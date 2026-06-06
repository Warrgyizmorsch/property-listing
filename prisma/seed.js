const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');

// Parse connection URL dynamically for driver adapter options
function getAdapterOptions(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname || "localhost",
      port: parseInt(url.port || "3306", 10),
      user: url.username || "root",
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.replace(/^\//, "") || "property_listing_db",
    };
  } catch (error) {
    console.error("Failed to parse DATABASE_URL:", error);
    return {};
  }
}

const adapterOptions = getAdapterOptions(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(adapterOptions);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');

  // 1. Seed Roles & Admin Users
  console.log('Seeding administrative users...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@propertylisting.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);
    adminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      }
    });
    console.log(`Created Super Admin user: ${adminEmail}`);
  } else {
    adminUser = existingAdmin;
    console.log(`Super Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Property Categories
  console.log('Seeding property categories...');
  const categories = [
    { name: 'Apartment', slug: 'apartment' },
    { name: 'Villa', slug: 'villa' },
    { name: 'Commercial', slug: 'commercial' },
    { name: 'Penthouse', slug: 'penthouse' },
    { name: 'Land', slug: 'land' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 3. Seed Property Statuses
  console.log('Seeding property statuses...');
  const statuses = [
    { name: 'Available', colorClass: 'bg-green-100 text-green-800 border-green-200' },
    { name: 'Sold', colorClass: 'bg-red-100 text-red-800 border-red-200' },
    { name: 'Under Offer', colorClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  ];

  for (const status of statuses) {
    await prisma.propertyStatus.upsert({
      where: { name: status.name },
      update: { colorClass: status.colorClass },
      create: status,
    });
  }
  console.log(`Seeded ${statuses.length} statuses.`);

  // 4. Seed Property Purposes
  console.log('Seeding property purposes...');
  const purposes = [
    { name: 'Buy' },
    { name: 'Sell' }
  ];

  for (const purpose of purposes) {
    await prisma.propertyPurpose.upsert({
      where: { name: purpose.name },
      update: {},
      create: purpose,
    });
  }
  console.log(`Seeded ${purposes.length} purposes.`);

  // 5. Seed initial Location tiers (Country -> State -> City)
  console.log('Seeding initial location hierarchy...');
  const country = await prisma.country.upsert({
    where: { name: 'United States' },
    update: {},
    create: {
      name: 'United States',
      slug: 'united-states',
    }
  });

  const state = await prisma.state.upsert({
    where: {
      countryId_name: {
        countryId: country.id,
        name: 'New York',
      }
    },
    update: {},
    create: {
      name: 'New York',
      slug: 'new-york',
      countryId: country.id,
    }
  });

  const city = await prisma.city.upsert({
    where: {
      stateId_name: {
        stateId: state.id,
        name: 'Manhattan',
      }
    },
    update: {},
    create: {
      name: 'Manhattan',
      slug: 'manhattan',
      stateId: state.id,
    }
  });
  console.log('Seeded Location: United States -> New York -> Manhattan.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
