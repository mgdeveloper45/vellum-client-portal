"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageInvoices } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createInvoiceSchema,
  invoiceMutationSchema,
} from "@/lib/validation/invoice";
import { redirect } from "next/navigation";

async function getWorkspaceId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });

  return user?.workspaceId;
}

/**
 * Creates a new invoice for a project.
 */
export async function createInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = createInvoiceSchema.parse({
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return;
  }

  const invoice = await prisma.invoice.create({
    data: {
      projectId: project.id,
      amount: input.amount,
      paid: false,
    },
  });

  await createAuditLog({
    action: "INVOICE_CREATED",
    entity: "INVOICE",
    entityId: invoice.id,
    userId: session.user.id,
    metadata: {
      amount: invoice.amount,
      projectId: invoice.projectId,
      paid: invoice.paid,
    },
  });

  redirect(`/projects/${project.id}`);
}

/**
 * Toggles paid on an invoice for a project.
 */
export async function toggleInvoicePaidAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = invoiceMutationSchema.parse({
    invoiceId: formData.get("invoiceId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: input.invoiceId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
  });

  if (!invoice) {
    return;
  }

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      paid: !invoice.paid,
    },
  });

  await createAuditLog({
    action: updatedInvoice.paid ? "INVOICE_PAID" : "INVOICE_UNPAID",
    entity: "INVOICE",
    entityId: updatedInvoice.id,
    userId: session.user.id,
    metadata: {
      amount: updatedInvoice.amount,
      projectId: updatedInvoice.projectId,
      paid: updatedInvoice.paid,
    },
  });

  redirect(`/projects/${input.projectId}`);
}

/**
 * Deletes an invoice for a project.
 */
export async function deleteInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageInvoices(session.user.role)) {
    return;
  }

  const input = invoiceMutationSchema.parse({
    invoiceId: formData.get("invoiceId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: input.invoiceId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
    select: {
      id: true,
      amount: true,
      paid: true,
    },
  });

  if (!invoice) {
    return;
  }

  await prisma.invoice.delete({
    where: {
      id: invoice.id,
    },
  });

  await createAuditLog({
    action: "INVOICE_DELETED",
    entity: "INVOICE",
    entityId: invoice.id,
    userId: session.user.id,
    metadata: {
      amount: invoice.amount,
      projectId: input.projectId,
      paid: invoice.paid,
    },
  });

  redirect(`/projects/${input.projectId}`);
}
