"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Creates a new invoice for a project.
 */
export async function createInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const amount = Number(formData.get("amount"));

  const invoice = await prisma.invoice.create({
    data: {
      projectId,
      amount,
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

  redirect(`/projects/${projectId}`);
}

/**
 * Toggles paid on an invoice for a project.
 */
export async function toggleInvoicePaidAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const invoiceId = String(formData.get("invoiceId"));

  const projectId = String(formData.get("projectId"));

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  });

  if (!invoice) {
    return;
  }

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
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

  redirect(`/projects/${projectId}`);
}

/**
 * Deletes an invoice for a project.
 */
export async function deleteInvoiceAction(formData: FormData) {
  const invoiceId = String(formData.get("invoiceId"));

  const projectId = String(formData.get("projectId"));

  await prisma.invoice.delete({
    where: {
      id: invoiceId,
    },
  });

  redirect(`/projects/${projectId}`);
}
