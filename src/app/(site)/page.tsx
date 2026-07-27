import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { LeadQualifier } from "@/components/LeadQualifier";
import { TrustStrip } from "@/components/TrustStrip";
import { courseTypes, services, whatsappLink } from "@/data/site";
import { universities, subjectAreas } from "@/data/universities";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-bleed image plane on mobile; Unisef-style copy-first on desktop */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/hero-graduation.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
        </div>

        <div className="hero-atmosphere relative hidden lg:block">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-8 py-16 lg:grid-cols-2">
            <div className="fade-up">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-teal">
                Applications open · Next intakes filling fast
              </p>
              <p className="display text-5xl text-navy xl:text-6xl">UNIADS</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-navy xl:text-4xl">
                Start your university journey today
              </h1>
              <p className="mt-4 text-lg font-semibold text-navy/90">
                Secure your place among the next new intakes into the university
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                From starting your application to sorting student finance,{" "}
                <strong className="font-bold text-navy">UNIADS</strong> is here to
                make your university journey smooth and stress-free.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/apply" variant="olive">
                  Apply Now — it&apos;s free
                </Button>
                <Button href={whatsappLink()} variant="secondary" external>
                  Message us on WhatsApp
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted">
                Trusted guidance across London, Birmingham, Manchester, Leeds and
                more UK cities
              </p>
            </div>

            <div className="fade-up-delay relative min-h-[520px]">
              <Image
                src="/images/hero-graduation.jpg"
                alt="Graduate holding a mortarboard outside a UK university building"
                fill
                priority
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-16 text-white sm:px-6 lg:hidden">
          <div className="fade-up">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-olive">
              Applications open · Next intakes filling fast
            </p>
            <p className="display text-4xl text-white">UNIADS</p>
            <h1 className="mt-2 text-2xl font-bold leading-snug text-white">
              Start your university journey today
            </h1>
            <p className="mt-3 text-base font-semibold text-white/95">
              Secure your place among the next new intakes
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              From application to student finance, UNIADS makes your university
              journey smooth and stress-free.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/apply" variant="olive" className="w-full sm:w-auto">
                Apply Now — it&apos;s free
              </Button>
              <Button
                href="/study-without-qualifications"
                variant="white"
                className="w-full sm:w-auto"
              >
                No GCSEs? Start here
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Uncover your potential */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <h2 className="display text-3xl text-navy sm:text-4xl lg:text-5xl">
              Uncover your potential
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Embark on your higher education journey with us by your side,
              preparing and guiding you every step of the way.{" "}
              <strong className="font-bold text-navy">UNIADS</strong> is here for
              you.
            </p>
          </div>

          <div className="mt-10">
            <p className="mb-3 inline-block bg-olive px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-deep">
              How We Help...
            </p>
            <p className="max-w-3xl text-base text-navy/80 sm:text-lg">
              Whether you are returning to education or starting fresh, UNIADS is
              here to guide you through every stage
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Free counselling & guidance",
                body: "Personalised advice on courses, universities and the right pathway for your goals.",
              },
              {
                title: "Student admission services",
                body: "We handle applications, documents, interviews and enrolment so you can focus on your future.",
              },
              {
                title: "Student finance support",
                body: "Step-by-step help with loans, grants and childcare funding applications.",
              },
            ].map((item) => (
              <div key={item.title} className="border-l-4 border-olive bg-cream/70 p-6">
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifier — form first on mobile for faster conversion */}
      <section className="bg-teal-soft/50">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-8 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">
              Check your eligibility
            </p>
            <h2 className="display mt-3 text-3xl text-navy sm:text-4xl">
              Tell us your status, course and study mode
            </h2>
            <p className="mt-4 text-muted">
              Student finance eligibility depends on your settlement status and UK
              residency, so we ask up front. Pick your answers and WhatsApp opens with
              a ready-made message — no long forms, no waiting.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-navy">
              {[
                "21+ can start with no formal qualifications",
                "18–21 need a Level 3 qualification",
                "Classes just 2 days a week — weekday, evening or weekend",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-olive">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button
              href="/study-without-qualifications"
              variant="ghost"
              className="mt-6"
            >
              No qualifications? Start here
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <LeadQualifier />
          </div>
        </div>
      </section>

      {/* Course types */}
      <section className="section-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="display text-3xl text-white sm:text-4xl">
            Discover our courses
          </h2>
          <p className="mt-4 max-w-2xl text-white/75">
            Find your path at top UK universities and colleges — with flexible
            schedules and pathways for students with or without prior
            qualifications.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {courseTypes.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="group border border-white/15 bg-white/5 p-6 transition hover:border-olive hover:bg-white/10"
              >
                <h3 className="display text-2xl text-olive group-hover:text-white">
                  {c.shortTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {c.description}
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-olive">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="display text-3xl text-navy sm:text-4xl">
                University application made easy
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Explore the full range of UNIADS services — from applications and
                certifications to finance, childcare grants and career support.
              </p>
            </div>
            <Button href="/services" variant="primary">
              View all services
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="bg-white p-5 transition hover:shadow-md"
              >
                <h3 className="font-bold text-navy">{s.shortTitle}</h3>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Courses & universities teaser */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy sm:text-4xl">
            Find your perfect course and apply today
          </h2>
          <p className="mt-4 max-w-3xl text-muted">
            Explore a wide range of courses across top universities in the UK.
            With flexible schedules, no prior qualifications required in many
            cases, and a simple application process, your next step in education
            is just a click away.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
                Available courses
              </h3>
              <ul className="mt-4 columns-1 gap-x-8 sm:columns-2">
                {subjectAreas.map((s) => (
                  <li
                    key={s}
                    className="mb-2 break-inside-avoid border-b border-line/80 py-2 text-sm font-medium text-navy"
                  >
                    {s}
                  </li>
                ))}
                <li className="mb-2 break-inside-avoid py-2 text-sm font-semibold text-teal">
                  And many more…
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-teal">
                Partner universities &amp; colleges
              </h3>
              <ul className="mt-4 space-y-2">
                {universities.slice(0, 10).map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={`/courses/${u.slug}`}
                      className="text-sm font-medium text-navy hover:text-teal"
                    >
                      {u.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button href="/courses" variant="ghost" className="mt-6">
                View all courses &amp; partners
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Online and on-campus courses available",
              "Full-time and part-time schedules",
              "Evening, morning and weekend classes",
              "No qualification required for many courses",
            ].map((item) => (
              <p key={item} className="text-sm font-semibold text-navy">
                <span className="mr-2 text-olive">✓</span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-teal-soft/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-navy sm:text-4xl">How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Choose your course",
                body: "Browse courses from top UK universities and colleges.",
              },
              {
                step: "02",
                title: "Apply online",
                body: "Complete our simple form and submit your documents with our help.",
              },
              {
                step: "03",
                title: "Interview & test",
                body: "We prepare you for interviews and assessments — online or on campus.",
              },
              {
                step: "04",
                title: "Admission offer",
                body: "Accept your offer and complete enrolment with UNIADS by your side.",
              },
            ].map((s) => (
              <li key={s.step} className="bg-white p-5">
                <span className="display text-3xl text-olive">{s.step}</span>
                <h3 className="mt-3 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certification + CTA */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="display text-3xl text-navy sm:text-4xl">
              Your trusted educational partner
            </h2>
            <p className="mt-4 text-muted">
              UNIADS is a UK educational consultancy focused on clear advice,
              honest guidance and successful enrolments. As a UK Certified
              Counsellor aligned with the British Council UK Agent Quality
              Framework, we put student outcomes first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/about" variant="primary">
                About UNIADS
              </Button>
              <Button href="/book" variant="ghost">
                Book a phone call
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/uk-certified-counsellor.svg"
              alt="I am a UK Certified Counsellor — British Council UK Agent Quality Framework"
              width={420}
              height={240}
              className="h-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="section-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="display text-3xl text-white sm:text-4xl lg:text-5xl">
            Ready to start?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Click below to apply now or book a phone consultation. UNIADS will
            guide you from first enquiry to enrolment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/apply" variant="olive">
              Apply Now
            </Button>
            <Button href="/courses" variant="white">
              Browse Courses
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
