"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#f7f4ef" }}>
        <h1 style={{ color: "#0b2b3a" }}>Something went wrong</h1>
        <p style={{ color: "#5a6b74" }}>
          UNIADS hit an unexpected error. Please refresh, or try again in a moment.
        </p>
        {error.digest ? (
          <p style={{ color: "#5a6b74", fontSize: "0.85rem" }}>Ref: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            background: "#0b2b3a",
            color: "white",
            border: 0,
            padding: "0.75rem 1.25rem",
            borderRadius: "6px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
