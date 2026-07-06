type AppRole = "OWNER" | "ADMIN" | "MANAGER" | "CLIENT";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: AppRole;
    };
  }

  interface User {
    role: AppRole;
  }
}

export {};