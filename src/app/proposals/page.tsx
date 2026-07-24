import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getProposalsService } from "@/lib/services/proposal/composition/proposal-services";

export default async function ProposalsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const proposals = await getProposalsService.execute({
    workspaceId,
    clientId:
      session.user.role === "ADMIN"
        ? undefined
        : session.user.id,
  });

  return (
    <BrandedDashboardShell>
      <div>
        <h1 className="text-3xl font-light">Proposals</h1>

        <p className="mt-2 text-foreground/70">
          Track project proposals and approval status.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">
                  {proposal.project.name}
                </h2>

                <p className="mt-2 text-sm text-foreground/50">
                  Client: {proposal.project.client.firstName}{" "}
                  {proposal.project.client.lastName}
                </p>
              </div>

              <span className="rounded-full bg-muted px-3 py-1 text-sm text-accent">
                {proposal.approved ? "Approved" : "Pending"}
              </span>
            </div>

            <p className="mt-5 text-xs text-foreground/50">
              Created {proposal.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </BrandedDashboardShell>
  );
}