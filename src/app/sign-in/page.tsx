export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="mb-6 text-3xl font-light">
          Sign In
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
          />

          <button
            className="w-full rounded-lg bg-accent px-4 py-3 text-black"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}