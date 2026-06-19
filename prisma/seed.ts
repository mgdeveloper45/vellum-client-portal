import "dotenv/config";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// PrismaClient lets us talk to the database from TypeScript.
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear old development data so every seed starts clean.
  await prisma.invoice.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.message.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create a sample client user.
  const client = await prisma.user.create({
    data: {
      email: "client@oakembercoffee.com",
      firstName: "Avery",
      lastName: "Stone",
      role: "CLIENT",
    },
  });

  // Create one project connected to that client.
  await prisma.project.create({
    data: {
      name: "Coffee Shop Brand Launch",
      description:
        "Brand identity, landing page, menu assets, launch planning, and approval workflow.",
      status: "ACTIVE",
      clientId: client.id,

      // These nested creates attach related records to the project.
      milestones: {
        create: [
          {
            title: "Brand Discovery",
            status: "COMPLETE",
            dueDate: new Date("2026-07-01"),
          },
          {
            title: "Website Design",
            status: "IN_PROGRESS",
            dueDate: new Date("2026-07-12"),
          },
        ],
      },

      messages: {
        create: [
          {
            senderId: client.id,
            content: "Excited to review the first design direction.",
          },
        ],
      },

      invoices: {
        create: [
          {
            amount: 2500,
            paid: false,
          },
        ],
      },

      proposals: {
        create: [
          {
            approved: false,
          },
        ],
      },
    },
  });
}

// Run the seed script.
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });