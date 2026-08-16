"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 40, textAlign: "center" }}>
        <h1>FORGE hit an error</h1>
        <p>{error.message}</p>
        <button type="button" onClick={reset}>
          Retry
        </button>
      </body>
    </html>
  );
}
