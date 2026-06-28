import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.booking.deleteMany();
  await prisma.businessHour.deleteMany();
  await prisma.service.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.workspaceInvitation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.message.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: "Vellum Workspace",
      companyName: "Vellum Premium",
      slug: "vellum-premium",
      accentColor: "#EF4444",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@vellum.app",
      firstName: "Vellum",
      lastName: "Admin",
      password: hashedPassword,
      role: "ADMIN",
      workspaceId: workspace.id,
    },
  });

  const clientOne = await prisma.user.create({
    data: {
      email: "client@oakembercoffee.com",
      firstName: "Avery",
      lastName: "Stone",
      password: hashedPassword,
      role: "CLIENT",
      workspaceId: workspace.id,
      notes: "Prefers email communication. Reviews designs every Friday.",
      isBlacklisted: false,
    },
  });

  const clientTwo = await prisma.user.create({
    data: {
      email: "client2@vellum.app",
      firstName: "Sarah",
      lastName: "Johnson",
      password: hashedPassword,
      role: "CLIENT",
      workspaceId: workspace.id,
      notes: "VIP client. Fast approval turnaround.",
      isBlacklisted: false,
    },
  });

  const initialConsultation = await prisma.service.create({
    data: {
      name: "Initial Consultation",
      description: "Discovery call for new clients",
      duration: 30,
      price: 5000,
      active: true,
      workspaceId: workspace.id,
    },
  });

  const websiteAudit = await prisma.service.create({
    data: {
      name: "Website Audit",
      description: "Review your website and identify improvements",
      duration: 60,
      price: 15000,
      active: true,
      workspaceId: workspace.id,
    },
  });

  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;

  for (const dayOfWeek of days) {
    await prisma.businessHour.create({
      data: {
        workspaceId: workspace.id,
        dayOfWeek,
        openTime: "09:00",
        closeTime: "17:00",
        closed: dayOfWeek === "SATURDAY" || dayOfWeek === "SUNDAY",
      },
    });
  }

  const projectOne = await prisma.project.create({
    data: {
      name: "Coffee Shop Brand Launch",
      description:
        "Brand identity, landing page, menu assets, launch planning, and approval workflow.",
      status: "ACTIVE",
      ownerId: admin.id,
      clientId: clientOne.id,
      workspaceId: workspace.id,

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

  await prisma.project.create({
    data: {
      name: "Luxury Salon Website",
      description:
        "Website redesign, booking flow, SEO optimization, and launch support.",
      status: "ACTIVE",
      ownerId: admin.id,
      clientId: clientTwo.id,
      workspaceId: workspace.id,

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.booking.create({
    data: {
      customerName: "Marcus Demo",
      customerEmail: "marcus@example.com",
      customerPhone: "555-123-4567",
      notes: "Seed booking for dashboard testing.",
      date: today,
      startTime: "10:00",
      endTime: "10:30",
      status: "CONFIRMED",
      serviceId: initialConsultation.id,
      workspaceId: workspace.id,
    },
  });

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  await prisma.booking.create({
    data: {
      customerName: "Avery Stone",
      customerEmail: "client@oakembercoffee.com",
      notes: "Website audit follow-up.",
      date: tomorrow,
      startTime: "11:00",
      endTime: "12:00",
      status: "PENDING",
      serviceId: websiteAudit.id,
      workspaceId: workspace.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED_CREATED",
      entity: "Workspace",
      entityId: workspace.id,
      userId: admin.id,
      metadata: {
        projectId: projectOne.id,
      },
    },
  });

  console.log("Seed completed successfully.");
  console.log("Workspace slug: vellum-premium");
  console.log("Admin email: admin@vellum.app");
  console.log("Admin password: password123");
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