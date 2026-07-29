"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

/**
 * Client-side sign-in form.
 * Supports credentials login and Google SSO.
 */
export function SignInForm() {
    async function handleSubmit(formData: FormData) {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            callbackUrl: "/dashboard",
        });
    }

    async function handleGoogleSignIn() {
        await signIn("google", {
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="space-y-4">
            <form action={handleSubmit} className="space-y-4">
                <label htmlFor="email" className="sr-only">
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                />

                <label htmlFor="password" className="sr-only">
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                />

                <button className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-black">
                    Sign In
                </button>
            </form>

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-foreground/50">or</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-medium transition hover:border-accent"
            >
                Continue with Google
            </button>

            <Link
                href="/forgot-password"
                className="block text-center text-sm text-accent"
            >
                Forgot password?
            </Link>
        </div>
    );
}