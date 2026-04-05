export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            ScrapeFlow
          </h1>
        </div>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Enterprise web scraping platform. Configure, schedule, and manage
          scraping jobs — no code required.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/auth/signin"
            className="btn-primary btn-md"
          >
            Get Started
          </a>
          <a
            href="/pricing"
            className="btn-secondary btn-md"
          >
            View Pricing
          </a>
        </div>
      </div>
    </main>
  );
}
