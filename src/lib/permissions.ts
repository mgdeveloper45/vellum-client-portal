type UserRole = "ADMIN" | "CLIENT";

export function isAdmin(role?: string | null) {
  return role === "ADMIN";
}

export function isClient(role?: string | null) {
  return role === "CLIENT";
}

export function canManageUsers(role?: string | null) {
  return isAdmin(role);
}

export function canManageClients(role?: string | null) {
  return isAdmin(role);
}

export function canManageProjects(role?: string | null) {
  return isAdmin(role);
}

export function canManageInvoices(role?: string | null) {
  return isAdmin(role);
}

export function canManageProposals(role?: string | null) {
  return isAdmin(role);
}

export function canViewProject(
  role: UserRole,
  userId: string,
  projectClientId: string,
) {
  if (role === "ADMIN") {
    return true;
  }

  return userId === projectClientId;
}
