export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = (...args: unknown[]) => {
  // Dynamic import keeps Sentry out of the bundle when DSN is not set
  void import("@sentry/nextjs").then(({ captureRequestError }) => {
    (captureRequestError as (...a: unknown[]) => void)(...args);
  });
};
