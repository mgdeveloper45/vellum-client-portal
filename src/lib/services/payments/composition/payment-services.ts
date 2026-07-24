import { CreateInvoiceCheckoutService } from "../create-invoice-checkout-service";
import { prismaPaymentRepository } from "../prisma-payment-repository";

export const createInvoiceCheckoutService = new CreateInvoiceCheckoutService(
  prismaPaymentRepository,
);
