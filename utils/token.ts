// Access token lives in memory only — never in localStorage/sessionStorage.
// Why: any XSS on the page can read localStorage, but it cannot read a
// plain JS module variable that isn't attached to `window`.
// Downside: it's lost on a hard refresh, which is why AuthProvider calls
// /refresh-token once on app load to silently restore the session using
// the httpOnly refresh cookie (which JS can never read, by design).

type Listener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<Listener>();

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },
  set(token: string | null): void {
    accessToken = token;
    listeners.forEach((listener) => listener(accessToken));
  },
  clear(): void {
    tokenStore.set(null);
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};