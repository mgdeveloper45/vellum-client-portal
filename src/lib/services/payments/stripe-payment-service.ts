import { stripe } from "@/lib/stripe";

type CreateInvoiceCheckoutSessionParams = {
  invoiceId: string;
  amount: number;
  description: string;
};

export async function createInvoiceCheckoutSession({
  invoiceId,
  amount,
  description,
}: CreateInvoiceCheckoutSessionParams) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: description,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.APP_URL}/payments/success?invoice=${invoiceId}`,
    cancel_url: `${process.env.APP_URL}/payments/cancel?invoice=${invoiceId}`,

    metadata: {
      invoiceId,
    },
  });
}
