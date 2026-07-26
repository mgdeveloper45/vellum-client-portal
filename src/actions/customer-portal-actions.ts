"use server";

import { auth } from "@/auth";
import { openCustomerPortalService } from "@/lib/services/billing/composition/billing-services";
import { redirect } from "next/navigation";

export async function openCustomerPortalAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const portalUrl = await openCustomerPortalService.execute(session.user.id);

  if (!portalUrl) {
    return;
  }

  redirect(portalUrl);
}
