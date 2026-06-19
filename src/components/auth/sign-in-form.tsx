"use client";

import { signIn } from "next-auth/react";

/**
 * Client-side sign-in form.
 * Uses the temporary credentials provider from src/auth.ts.
 */
export function SignInForm() {
    async function handleSubmit(formData: FormData) {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            callbackUrl: "/dashboard",
        });
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input
                name="email"
                type="email"
                placeholder="Email"
                defaultValue="admin@vellum.app"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                defaultValue="password123"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-black">
                Sign In
            </button>
        </form>
    );
}