"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createInvoiceCheckoutSession } from "@/lib/services/payments/stripe-payment-service";

export async function createInvoiceCheckoutAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const invoiceId = String(formData.get("invoiceId") ?? "").trim();

  if (!invoiceId) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      paid: false,
      project: {
        workspaceId: currentUser.workspaceId,
      },
    },
    include: {
      project: true,
    },
  });

  if (!invoice) {
    return;
  }

  const checkoutSession = await createInvoiceCheckoutSession({
    invoiceId: invoice.id,
    amount: invoice.amount,
    description: `Invoice for ${invoice.project.name}`,
  });

  if (!checkoutSession.url) {
    return;
  }

  redirect(checkoutSession.url);
}
