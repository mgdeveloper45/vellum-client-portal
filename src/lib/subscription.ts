import { prisma } from "@/lib/prisma";

export async function hasProfessionalPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      workspace: {
        include: {
          subscription: true,
        },
      },
    },
  });

  return (
    user?.workspace?.subscription?.active === true &&
    user.workspace.subscription.plan === "PROFESSIONAL"
  );
}
