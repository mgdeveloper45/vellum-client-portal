"use server";

import { auth } from "@/auth";
import { createCheckoutSessionService } from "@/lib/services/billing/composition/billing-services";
import { redirect } from "next/navigation";

export async function createCheckoutSessionAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const checkoutUrl = await createCheckoutSessionService.execute(
    session.user.id,
  );

  if (!checkoutUrl) {
    return;
  }

  redirect(checkoutUrl);
}
