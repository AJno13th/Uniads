"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");

    const response = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: form.get("password"),
        name: form.get("name"),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Unable to sign in.");
      setBusy(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm"
    >
      <div>
        <label className="label" htmlFor="name">
          Your name
        </label>
        <input id="name" name="name" className="input" placeholder="Advisor name" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          CRM password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-navy-deep disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
