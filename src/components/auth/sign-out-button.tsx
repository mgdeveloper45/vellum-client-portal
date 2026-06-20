"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      className="rounded-lg border border-border px-4 py-2 text-sm"
    >
      Sign Out
    </button>
  );
}