export function assertRole(role: string, allowed: string[]) {
  if (!allowed.includes(role)) {
    throw new Error("Forbidden");
  }
}

export function assertWorkspaceOwnership(
  resourceWorkspaceId: string,
  userWorkspaceId: string,
) {
  if (resourceWorkspaceId !== userWorkspaceId) {
    throw new Error("Forbidden");
  }
}
// assertAuthenticated()

// assertWorkspaceMember()

// assertOwner()

// assertAdmin()

// assertManager()

// assertCanManageInvoices()

// assertCanManageWorkspace()