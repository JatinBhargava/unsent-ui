const DEFAULT_API_BASE_URL = "";

function sanitizeApiBaseUrl(value?: string) {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  const trimmedValue = value.trim();
  const normalized = trimmedValue.toLowerCase();

  if (!trimmedValue || normalized === "undefined" || normalized === "null") {
    return DEFAULT_API_BASE_URL;
  }

  try {
    const parsed = new URL(trimmedValue);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return DEFAULT_API_BASE_URL;
    }

    return parsed.origin;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

export function getApiBaseUrl() {
  const value = sanitizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL).replace(
    /\/+$/,
    "",
  );

  return value || window.location.origin;
}
