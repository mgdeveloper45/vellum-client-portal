export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080503] text-[#f5ead8]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between border-b border-[#2a1a0c] pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#9b7a3c]">
              Vellum
            </p>
            <h1 className="mt-2 text-3xl font-light">
              Client Portal
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="rounded-full border border-[#7a6025] px-5 py-2 text-sm text-[#f5ead8]">
              Sign in
            </button>
            <button className="rounded-full bg-[#f5ead8] px-5 py-2 text-sm font-medium text-[#080503]">
              Get Started
            </button>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#9b7a3c]">
              Elegant project management
            </p>

            <h2 className="max-w-2xl text-5xl font-light leading-tight md:text-7xl">
              A polished home for client work, approvals, files, and trust.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#c9b99d]">
              Vellum gives creative teams and service businesses a refined
              client portal to manage projects, proposals, messages,
              milestones, invoices, and deliverables.
            </p>

            <div className="mt-10 flex gap-4">
              <button className="rounded-full bg-[#f5ead8] px-6 py-3 font-medium text-[#080503]">
                Start Portal
              </button>
              <button className="rounded-full border border-[#7a6025] px-6 py-3 text-[#f5ead8]">
                View Demo
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#33200a] bg-[#120b05] p-6 shadow-2xl">
            <div className="rounded-[1.5rem] border border-[#33200a] bg-[#080503] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#9b7a3c]">
                Project Overview
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Brand Discovery",
                  "Website Design",
                  "Client Approval",
                  "Final Delivery",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-[#2a1a0c] bg-[#120b05] p-4"
                  >
                    <div>
                      <p className="text-[#f5ead8]">{item}</p>
                      <p className="text-sm text-[#8f806c]">
                        Phase {index + 1}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#221507] px-3 py-1 text-xs text-[#c9a646]">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}