import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Database adapter used by Prisma 7.
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * Prisma client used for seeding local development data.
 */
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  /**
   * Shared demo password for local development accounts only.
   * Never hardcode production passwords.
   */
  const hashedPassword = await bcrypt.hash("password123", 10);

  /**
   * Clear old development data so every seed starts clean.
   */
  await prisma.invoice.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.message.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  /**
   * Admin/business owner account.
   */
  const admin = await prisma.user.create({
    data: {
      email: "admin@vellum.app",
      firstName: "Vellum",
      lastName: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  /**
   * Client account #1.
   */
  const clientOne = await prisma.user.create({
    data: {
      email: "client@oakembercoffee.com",
      firstName: "Avery",
      lastName: "Stone",
      password: hashedPassword,
      role: "CLIENT",
      notes: "Prefers email communication. Reviews designs every Friday.",
      isBlacklisted: false,
    },
  });

  /**
   * Client account #2.
   */
  const clientTwo = await prisma.user.create({
    data: {
      email: "client2@vellum.app",
      firstName: "Sarah",
      lastName: "Johnson",
      password: hashedPassword,
      role: "CLIENT",
      notes: "VIP client. Fast approval turnaround.",
      isBlacklisted: false,
    },
  });

  /**
   * Project #1 connected to client #1.
   */
  await prisma.project.create({
    data: {
      name: "Coffee Shop Brand Launch",
      description:
        "Brand identity, landing page, menu assets, launch planning, and approval workflow.",
      status: "ACTIVE",
      ownerId: admin.id,
      clientId: clientOne.id,

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
            senderId: clientOne.id,
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

  /**
   * Project #2 connected to client #2.
   */
  await prisma.project.create({
    data: {
      name: "Luxury Salon Website",
      description:
        "Website redesign, booking flow, SEO optimization, and launch support.",
      status: "ACTIVE",
      ownerId: admin.id,
      clientId: clientTwo.id,

      milestones: {
        create: [
          {
            title: "Content Planning",
            status: "COMPLETE",
            dueDate: new Date("2026-07-05"),
          },
          {
            title: "Booking Flow Design",
            status: "IN_PROGRESS",
            dueDate: new Date("2026-07-18"),
          },
        ],
      },

      messages: {
        create: [
          {
            senderId: clientTwo.id,
            content: "The booking page direction looks great so far.",
          },
        ],
      },

      invoices: {
        create: [
          {
            amount: 4200,
            paid: true,
          },
        ],
      },

      proposals: {
        create: [
          {
            approved: true,
          },
        ],
      },
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });