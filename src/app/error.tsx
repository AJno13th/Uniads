"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="display text-3xl text-navy">This page hit a snag</h1>
      <p className="mt-3 text-sm text-muted">
        Please try again. If it keeps happening, WhatsApp us on the floating button
        or email info@uniads.co.uk.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-muted">Ref: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-navy px-5 py-2.5 text-sm font-bold text-white"
      >
        Try again
      </button>
    </div>
  );
}
