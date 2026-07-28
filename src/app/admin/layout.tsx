import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/crm/auth";
import { isDurableStorage, storeMode } from "@/lib/crm/store";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UNIADS CRM",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const durable = isDurableStorage();
  const mode = storeMode();

  return (
    <div className="flex min-h-full flex-col bg-[#eef1f6]">
      <header className="border-b border-navy/10 bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="display text-xl tracking-wide">
              UNIADS <span className="text-olive">CRM</span>
            </Link>
            {session && (
              <nav className="flex gap-4 text-sm">
                <Link href="/admin" className="text-white/80 hover:text-olive">
                  Pipeline
                </Link>
                <a
                  href="/api/leads/export"
                  download
                  className="text-white/80 hover:text-olive"
                >
                  Export CSV
                </a>
                <Link href="/" className="text-white/80 hover:text-olive">
                  View website
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`rounded-full px-3 py-1 ${
                durable ? "bg-olive/20 text-olive" : "bg-amber-400/20 text-amber-100"
              }`}
            >
              storage: {mode}
              {!durable ? " (ephemeral)" : ""}
            </span>
            {session && (
              <>
                <span className="text-white/70">Signed in as {session.user}</span>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </header>
      {!durable && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-6">
          <p className="mx-auto max-w-7xl font-semibold">
            Bookings are not saving into this CRM yet
          </p>
          <p className="mx-auto mt-1 max-w-7xl text-amber-900/90">
            Production is running in file storage mode. On Vercel that writes to temporary
            disk, so leads disappear between requests. In Vercel → Settings → Environment
            Variables, set <code className="rounded bg-amber-100 px-1 font-mono text-xs">DATABASE_URL</code>{" "}
            (or <code className="rounded bg-amber-100 px-1 font-mono text-xs">POSTGRES_URL</code> from
            the Neon integration) for <strong>Production</strong>, then redeploy. Until then,
            check WhatsApp and{" "}
            <code className="rounded bg-amber-100 px-1 font-mono text-xs">info@uniads.co.uk</code>{" "}
            for lead alerts.
          </p>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
