"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "CLIENT" | "PROJECT" | "BOOKING" | "INVOICE" | "MESSAGE" | "SERVICE";
  title: string;
  subtitle: string;
  href: string;
};

export async function searchWorkspaceAction(
  query: string,
): Promise<SearchResult[]> {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId || query.trim().length < 2) {
    return [];
  }

  const search = query.trim();

  const [clients, projects, bookings, invoices, messages, services] =
    await Promise.all([
      prisma.user.findMany({
        where: {
          workspaceId: currentUser.workspaceId,
          role: "CLIENT",
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),

      prisma.project.findMany({
        where: {
          workspaceId: currentUser.workspaceId,
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),

      prisma.booking.findMany({
        where: {
          workspaceId: currentUser.workspaceId,
          OR: [
            { customerName: { contains: search, mode: "insensitive" } },
            { customerEmail: { contains: search, mode: "insensitive" } },
          ],
        },
        include: {
          service: true,
        },
        take: 5,
      }),

      prisma.invoice.findMany({
        where: {
          project: {
            workspaceId: currentUser.workspaceId,
          },
        },
        include: {
          project: true,
        },
        take: 5,
      }),

      prisma.message.findMany({
        where: {
          project: {
            workspaceId: currentUser.workspaceId,
          },
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          project: true,
        },
        take: 5,
      }),

      prisma.service.findMany({
        where: {
          workspaceId: currentUser.workspaceId,
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
    ]);

  return [
    ...clients.map((client) => ({
      id: client.id,
      type: "CLIENT" as const,
      title: `${client.firstName} ${client.lastName}`,
      subtitle: client.email,
      href: `/clients/${client.id}`,
    })),

    ...projects.map((project) => ({
      id: project.id,
      type: "PROJECT" as const,
      title: project.name,
      subtitle: project.description || "Project",
      href: `/projects/${project.id}`,
    })),

    ...bookings.map((booking) => ({
      id: booking.id,
      type: "BOOKING" as const,
      title: booking.customerName,
      subtitle: `${booking.service.name} · ${booking.date.toLocaleDateString()} · ${booking.startTime}`,
      href: `/bookings/${booking.id}`,
    })),

    ...invoices.map((invoice) => ({
      id: invoice.id,
      type: "INVOICE" as const,
      title: `$${invoice.amount.toLocaleString()}`,
      subtitle: `${invoice.paid ? "Paid" : "Unpaid"} · ${invoice.project.name}`,
      href: `/projects/${invoice.projectId}`,
    })),

    ...messages.map((message) => ({
      id: message.id,
      type: "MESSAGE" as const,
      title: message.project.name,
      subtitle: message.content.slice(0, 90),
      href: `/projects/${message.projectId}`,
    })),

    ...services.map((service) => ({
      id: service.id,
      type: "SERVICE" as const,
      title: service.name,
      subtitle: `${service.duration} min · $${service.price}`,
      href: "/services",
    })),
  ];
}
