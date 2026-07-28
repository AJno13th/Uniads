import { redirect } from "next/navigation";
import { getSession, isCrmConfigured } from "@/lib/crm/auth";
import { isDurableStorage, storeMode } from "@/lib/crm/store";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  const durable = isDurableStorage();
  const mode = storeMode();

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
      <h1 className="display text-3xl text-navy">Sign in to the CRM</h1>
      <p className="mt-2 text-sm text-muted">
        Lead management for UNIADS advisors.
      </p>
      {isCrmConfigured() ? (
        <>
          <LoginForm />
          {durable ? (
            <p className="mt-6 text-sm text-muted">
              Storage: <span className="font-semibold text-navy">{mode}</span> — new
              bookings will appear in the pipeline after you sign in.
            </p>
          ) : (
            <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Database not connected yet</p>
              <p className="mt-2">
                Add Neon <code className="font-mono text-xs">DATABASE_URL</code> (or{" "}
                <code className="font-mono text-xs">POSTGRES_URL</code>) in Vercel for
                Production, then redeploy. Until then leads will not stay in this portal.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">CRM password not configured</p>
          <p className="mt-2">
            Set the <code className="font-mono">CRM_ADMIN_PASSWORD</code> environment
            variable (and optionally <code className="font-mono">CRM_SESSION_SECRET</code>{" "}
            and <code className="font-mono">DATABASE_URL</code>) on your hosting
            platform, then reload this page.
          </p>
        </div>
      )}
    </div>
  );
}
