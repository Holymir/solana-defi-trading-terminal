export function logInfo(message: string, data?: unknown): void {
  const ts = new Date().toISOString();
  if (data !== undefined) {
    console.log(`[${ts}] INFO ${message}`, data);
    return;
  }
  console.log(`[${ts}] INFO ${message}`);
}

export function logError(message: string, error: unknown): void {
  const ts = new Date().toISOString();
  console.error(`[${ts}] ERROR ${message}`, error);
}