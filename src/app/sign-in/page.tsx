import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accent">
          Vellum
        </p>

        <h1 className="mt-3 text-3xl font-light">
          Sign In
        </h1>

        <p className="mt-2 text-sm text-foreground/70">
          Access your client operations workspace.
        </p>

        <div className="mt-8">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}