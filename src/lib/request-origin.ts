/** Compare the browser's origin to the actual HTTP host, not Next's normalized internal URL. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.origin === origin && parsed.host.toLowerCase() === host.toLowerCase();
  } catch { return false; }
}
