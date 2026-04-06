const DEFAULT_API_BASE_URL = "http://localhost:8080";
const DEFAULT_OAUTH_BASE_URL = DEFAULT_API_BASE_URL;

function sanitizeApiBaseUrl(value?: string) {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  const trimmedValue = value.trim();
  const normalized = trimmedValue.toLowerCase();

  if (!trimmedValue || normalized === "undefined" || normalized === "null") {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedValue;
}

export function getApiBaseUrl() {
  return sanitizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL).replace(
    /\/+$/,
    "",
  );
}

export function getOauthBaseUrl() {
  return sanitizeApiBaseUrl(import.meta.env.VITE_OAUTH_REDIRECT_URL).replace(
    /\/+$/,
    "",
  ) || DEFAULT_OAUTH_BASE_URL;
}
