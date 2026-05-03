const DEFAULT_API_BASE_URL = "";
const DEFAULT_OAUTH_BASE_URL = "";

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
  const value = sanitizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL).replace(
    /\/+$/,
    "",
  );

  return value || window.location.origin;
}

export function getOauthBaseUrl() {
  const value = sanitizeApiBaseUrl(
    import.meta.env.VITE_OAUTH_REDIRECT_URL,
  ).replace(/\/+$/, "");

  return value || getApiBaseUrl() || window.location.origin;
}
