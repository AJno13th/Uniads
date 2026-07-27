import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/crm/auth";
import { storeMode } from "@/lib/crm/store";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "UNIADS CRM",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

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
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">
              storage: {storeMode()}
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
      <div className="flex-1">{children}</div>
    </div>
  );
}
