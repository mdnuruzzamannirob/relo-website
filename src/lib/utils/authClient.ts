const DEFAULT_API_URL = 'https://relo-ecommerce-backend.vercel.app/api/v1';
const DEFAULT_GOOGLE_CALLBACK_PATH = '/auth/google/callback';
const DEFAULT_GOOGLE_SUCCESS_PATH = '/auth/google/success';
const DEFAULT_GOOGLE_FAIL_PATH = '/auth/google/fail';

const TOKEN_QUERY_KEYS = ['token', 'authToken', 'accessToken'] as const;
const AUTH_QUERY_KEYS = [...TOKEN_QUERY_KEYS, 'data', 'error', 'message'] as const;

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

const sanitizeToken = (value: string | null) => {
  if (!value) return null;

  const token = value.trim();
  return token.length > 0 ? token : null;
};

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseJsonSafely = <T>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getAppOrigin = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
};

const getGoogleCallbackPath = () =>
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT_PATH || DEFAULT_GOOGLE_CALLBACK_PATH;

const getGoogleSuccessPath = () =>
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_SUCCESS_PATH || DEFAULT_GOOGLE_SUCCESS_PATH;

const getGoogleFailPath = () =>
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_FAIL_PATH || DEFAULT_GOOGLE_FAIL_PATH;

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const getGoogleRedirectUrl = () => {
  const origin = getAppOrigin();
  const callbackPath = normalizePath(getGoogleCallbackPath());

  return `${origin}${callbackPath}`;
};

export const getGoogleSuccessUrl = () => {
  const origin = getAppOrigin();
  return `${origin}${normalizePath(getGoogleSuccessPath())}`;
};

export const getGoogleFailUrl = () => {
  const origin = getAppOrigin();
  return `${origin}${normalizePath(getGoogleFailPath())}`;
};

export const getGoogleSignInUrl = () => {
  const baseGoogleUrl = `${getApiBaseUrl()}/auth/signin/google`;
  const successUrl = getGoogleSuccessUrl();
  const failUrl = getGoogleFailUrl();
  const fallbackUrl = getGoogleRedirectUrl();

  if (!successUrl && !failUrl && !fallbackUrl) return baseGoogleUrl;

  const query = new URLSearchParams();

  if (successUrl) {
    query.set('redirectUrl', successUrl);
    query.set('successUrl', successUrl);
    query.set('successRedirectUrl', successUrl);
  } else if (fallbackUrl) {
    query.set('redirectUrl', fallbackUrl);
  }

  if (failUrl) {
    query.set('failUrl', failUrl);
    query.set('failureUrl', failUrl);
    query.set('failureRedirectUrl', failUrl);
  }

  return `${baseGoogleUrl}?${query.toString()}`;
};

interface GoogleAuthSuccessData {
  token?: string;
  authToken?: string;
  accessToken?: string;
  userData?: unknown;
}

const getDataParamFromCurrentUrl = () => {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const fromSearch = url.searchParams.get('data');
  if (fromSearch) return fromSearch;

  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);
  return hashParams.get('data');
};

export const getGoogleAuthDataFromCurrentUrl = () => {
  const rawData = getDataParamFromCurrentUrl();
  if (!rawData) return null;

  const attempts = Array.from(
    new Set([
      rawData,
      safeDecodeURIComponent(rawData),
      safeDecodeURIComponent(safeDecodeURIComponent(rawData)),
    ]),
  );

  for (const raw of attempts) {
    const parsed = parseJsonSafely<GoogleAuthSuccessData>(raw);
    if (parsed) return parsed;
  }

  return null;
};

export const getAuthTokenFromCurrentUrl = () => {
  if (typeof window === 'undefined') return null;

  const dataPayload = getGoogleAuthDataFromCurrentUrl();

  if (dataPayload) {
    for (const key of TOKEN_QUERY_KEYS) {
      const fromData = sanitizeToken(
        (dataPayload as Record<string, string | undefined>)[key] || null,
      );
      if (fromData) return fromData;
    }
  }

  const url = new URL(window.location.href);

  for (const key of TOKEN_QUERY_KEYS) {
    const fromSearch = sanitizeToken(url.searchParams.get(key));
    if (fromSearch) return fromSearch;
  }

  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);

  for (const key of TOKEN_QUERY_KEYS) {
    const fromHash = sanitizeToken(hashParams.get(key));
    if (fromHash) return fromHash;
  }

  return null;
};

export const clearAuthTokenFromCurrentUrl = () => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);

  AUTH_QUERY_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);

  AUTH_QUERY_KEYS.forEach((key) => {
    hashParams.delete(key);
  });

  const hash = hashParams.toString();
  const nextUrl = `${url.pathname}${url.search}${hash ? `#${hash}` : ''}`;

  window.history.replaceState(null, '', nextUrl);
};

export const getGoogleAuthErrorFromCurrentUrl = () => {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const errorMessage = url.searchParams.get('error') || url.searchParams.get('message');

  if (errorMessage) return errorMessage;

  const hashParams = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : url.hash);
  return hashParams.get('error') || hashParams.get('message');
};
