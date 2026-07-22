"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      paid: false,
      project: {
        workspaceId,
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
