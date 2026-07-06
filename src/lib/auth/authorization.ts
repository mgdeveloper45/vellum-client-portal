import { auth } from "../../auth";
import { assertRole, assertWorkspaceOwnership } from "./authorization-rules";

export { assertRole, assertWorkspaceOwnership };

export async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
