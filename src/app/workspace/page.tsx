import { auth } from "@/auth";
import { createWorkspaceInvitationAction } from "@/actions/workspace-invitation-actions";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import {
  canInviteMembers,
  canManageWorkspace,
} from "@/lib/permissions";
import { getWorkspacePageQuery } from "@/lib/queries/workspace/get-workspace-page-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";

export default async function WorkspacePage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const canInvite = canInviteMembers(session.user.role);
  const canManage = canManageWorkspace(session.user.role);

  const workspaceId = await getCurrentUserWorkspaceQuery(
    session.user.id,
  );

  if (!workspaceId) {
    return null;
  }

  const {
    members,
    invitations,
  } = await getWorkspacePageQuery(
    workspaceId,
    canInvite,
  );

  return (
    <BrandedDashboardShell>
      <h1 className="text-3xl font-light">
        Workspace Members
      </h1>

      <p className="mt-2 text-foreground/70">
        Manage everyone inside your workspace.
      </p>

      {canInvite && (
        <form
          action={createWorkspaceInvitationAction}
          className="mt-8 rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-xl font-medium">
            Invite Member
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="rounded-lg border border-border bg-background px-4 py-3"
            />

            <select
              name="role"
              defaultValue="CLIENT"
              className="rounded-lg border border-border bg-background px-4 py-3"
            >
              <option value="CLIENT">Client</option>
              <option value="MANAGER">Manager</option>
              {canManage && (
                <option value="ADMIN">
                  Admin
                </option>
              )}
            </select>

            <button className="rounded-lg bg-accent px-4 py-3 font-medium text-black">
              Send Invite
            </button>
          </div>
        </form>
      )}

      {canInvite && (
        <div className="mt-8">
          <h2 className="text-xl font-medium">
            Pending Invitations
          </h2>

          <div className="mt-4 grid gap-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="font-medium">
                  {invitation.email}
                </p>

                <p className="mt-1 text-sm text-foreground/70">
                  Role: {invitation.role}
                </p>

                <p className="mt-2 text-xs text-foreground/50">
                  Expires{" "}
                  {invitation.expiresAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="font-medium">
              {member.firstName}{" "}
              {member.lastName}
            </p>

            <p className="text-sm text-foreground/70">
              {member.email}
            </p>

            <p className="mt-2 text-xs">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </BrandedDashboardShell>
  );
}