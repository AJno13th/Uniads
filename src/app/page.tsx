import Link from "next/link";
import { MarketingNav } from "@/components/AppNav";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative min-h-[100svh] overflow-hidden hero-plane">
        <MarketingNav />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:pb-24">
          <p className="animate-rise font-display text-6xl text-white sm:text-8xl md:text-9xl">
            FORGE
          </p>
          <h1 className="animate-rise-delay mt-4 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl">
            Continuous reps. Cylinder targets. Fuel that answers back.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/75 animate-rise-delay">
            Rank every weight you move without stopping — then eat what your last
            meal, training load, and goal actually demand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay">
            <Link
              href="/free-reading"
              className="bg-signal px-6 py-3 font-semibold text-white transition hover:bg-signal-deep"
            >
              Free body reading
            </Link>
            <Link
              href="/app"
              className="border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Enter the app
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute -right-10 bottom-24 hidden h-64 w-40 opacity-40 sm:block animate-pulse-soft"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.25))",
            borderRadius: "999px",
            boxShadow: "inset 0 0 40px rgba(255,255,255,0.2)",
          }}
        />
      </section>

      <section className="grain border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Cylinders that know your expected reps
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Each weight gets a cylinder filled toward the continuous-rep target —
              how many you can do in one go, no pausing mid-set. Beat the fill, raise
              the rank.
            </p>
          </div>
          <div className="flex justify-center gap-4 py-4">
            {[
              { w: 60, e: 12, a: 12 },
              { w: 70, e: 10, a: 8 },
              { w: 80, e: 8, a: 9 },
            ].map((c, i) => (
              <div
                key={c.w}
                className="flex flex-col items-center gap-2"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="relative h-36 w-12 overflow-hidden rounded-t-full border border-stone-deep bg-stone">
                  <div
                    className="absolute inset-x-0 bottom-0 animate-fill"
                    style={{
                      height: `${(c.a / c.e) * 100}%`,
                      background:
                        c.a >= c.e
                          ? "linear-gradient(180deg,#e85d04,#c24a00)"
                          : "linear-gradient(180deg,#1a9a94,#0f6e6a)",
                    }}
                  />
                </div>
                <p className="font-display text-lg">{c.w}kg</p>
                <p className="text-xs text-muted">
                  {c.a}/{c.e} continuous
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-fog">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-4xl sm:text-5xl">One system. Train + fuel.</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                t: "Free readings",
                d: "Weight, height, BMI, and food direction — no paywall to try the intelligence.",
              },
              {
                t: "Adaptive meals",
                d: "Next plate is chosen from what you ate, how hard you trained, and your cut/build target — macros and minerals included.",
              },
              {
                t: "Photo fuel",
                d: "Snap a plate. FORGE estimates the meal, then locks macros into your daily budget.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-display text-2xl text-signal">{item.t}</h3>
                <p className="mt-2 text-sm text-white/70">{item.d}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/free-reading"
            className="mt-12 inline-block bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-deep"
          >
            Start with a free reading
          </Link>
        </div>
      </section>
    </main>
  );
}
