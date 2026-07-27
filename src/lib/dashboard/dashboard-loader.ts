import { auth } from "@/auth";

export async function requireDashboardUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user;
}
