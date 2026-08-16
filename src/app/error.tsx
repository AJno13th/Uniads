"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl">Something broke</h1>
      <p className="max-w-md text-sm text-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="bg-ink px-4 py-2 text-fog"
      >
        Try again
      </button>
    </main>
  );
}
