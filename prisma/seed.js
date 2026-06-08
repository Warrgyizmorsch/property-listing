const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const bcrypt = require("bcryptjs");

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
  console.log("Starting database seeding...");

  // 1. Seed Roles & Admin Users
  console.log("Seeding administrative users...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@propertylisting.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);
    adminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Created Super Admin user: ${adminEmail}`);
  } else {
    adminUser = existingAdmin;
    console.log(`Super Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Property Categories
  console.log("Seeding property categories...");
  const categories = [
    { name: "Apartment", slug: "apartment" },
    { name: "Villa", slug: "villa" },
    { name: "Commercial", slug: "commercial" },
    { name: "Penthouse", slug: "penthouse" },
    { name: "Land", slug: "land" },
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
  console.log("Seeding property statuses...");
  const statuses = [
    {
      name: "Available",
      colorClass: "bg-green-100 text-green-800 border-green-200",
    },
    { name: "Sold", colorClass: "bg-red-100 text-red-800 border-red-200" },
    {
      name: "Under Offer",
      colorClass: "bg-amber-100 text-amber-800 border-amber-200",
    },
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
  console.log("Seeding property purposes...");
  const purposes = [{ name: "Buy" }, { name: "Sell" }];

  for (const purpose of purposes) {
    await prisma.propertyPurpose.upsert({
      where: { name: purpose.name },
      update: {},
      create: purpose,
    });
  }
  console.log(`Seeded ${purposes.length} purposes.`);

  // 5. Seed initial Location tiers (Country -> State -> City)
  console.log("Seeding initial location hierarchy...");
  const country = await prisma.country.upsert({
    where: { name: "India" },
    update: {},
    create: {
      name: "India",
      slug: "india",
    },
  });

  // Maharashtra State
  const maharashtra = await prisma.state.upsert({
    where: {
      countryId_name: {
        countryId: country.id,
        name: "Maharashtra",
      },
    },
    update: {},
    create: {
      name: "Maharashtra",
      slug: "maharashtra",
      countryId: country.id,
    },
  });

  // Mumbai City
  const mumbai = await prisma.city.upsert({
    where: {
      stateId_name: {
        stateId: maharashtra.id,
        name: "Mumbai",
      },
    },
    update: {},
    create: {
      name: "Mumbai",
      slug: "mumbai",
      stateId: maharashtra.id,
    },
  });

  // Bangalore State
  const karnataka = await prisma.state.upsert({
    where: {
      countryId_name: {
        countryId: country.id,
        name: "Karnataka",
      },
    },
    update: {},
    create: {
      name: "Karnataka",
      slug: "karnataka",
      countryId: country.id,
    },
  });

  // Bangalore City
  await prisma.city.upsert({
    where: {
      stateId_name: {
        stateId: karnataka.id,
        name: "Bangalore",
      },
    },
    update: {},
    create: {
      name: "Bangalore",
      slug: "bangalore",
      stateId: karnataka.id,
    },
  });

  // Delhi State
  const delhi = await prisma.state.upsert({
    where: {
      countryId_name: {
        countryId: country.id,
        name: "Delhi",
      },
    },
    update: {},
    create: {
      name: "Delhi",
      slug: "delhi",
      countryId: country.id,
    },
  });

  // Delhi City
  await prisma.city.upsert({
    where: {
      stateId_name: {
        stateId: delhi.id,
        name: "New Delhi",
      },
    },
    update: {},
    create: {
      name: "New Delhi",
      slug: "new-delhi",
      stateId: delhi.id,
    },
  });

  // Hyderabad State
  const telangana = await prisma.state.upsert({
    where: {
      countryId_name: {
        countryId: country.id,
        name: "Telangana",
      },
    },
    update: {},
    create: {
      name: "Telangana",
      slug: "telangana",
      countryId: country.id,
    },
  });

  // Hyderabad City
  await prisma.city.upsert({
    where: {
      stateId_name: {
        stateId: telangana.id,
        name: "Hyderabad",
      },
    },
    update: {},
    create: {
      name: "Hyderabad",
      slug: "hyderabad",
      stateId: telangana.id,
    },
  });

  console.log(
    "Seeded Location: India -> Maharashtra -> Mumbai, Karnataka -> Bangalore, Delhi, Telangana -> Hyderabad.",
  );

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
