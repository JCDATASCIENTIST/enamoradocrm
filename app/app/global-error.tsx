'use client';

// Global error boundary for the entire CRM. Catches errors that escape the
// (app) group's boundary (e.g. middleware failures, root layout issues).

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ maxWidth: 640, margin: '64px auto', padding: 24, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, color: '#475569', fontSize: 14 }}>
            A critical error occurred. Please try again, or contact your administrator if the problem persists.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: '8px 16px',
              background: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
