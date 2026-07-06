type Role = "OWNER" | "ADMIN" | "MANAGER" | "CLIENT" | undefined | null;

export function canManageWorkspace(role: Role) {
  return role === "OWNER" || role === "ADMIN";
}

export function canInviteMembers(role: Role) {
  return role === "OWNER" || role === "ADMIN";
}

export function canManageUsers(role: Role) {
  return role === "OWNER" || role === "ADMIN";
}

export function canManageBilling(role: Role) {
  return role === "OWNER";
}

export function canManageProjects(role: Role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export function canManageInvoices(role: Role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export function canManageProposals(role: Role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export function canManageFiles(role: Role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export function canViewAdminNav(role: Role) {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export function canManageClients(role?: string | null) {
  return role === "ADMIN" || role === "OWNER";
}