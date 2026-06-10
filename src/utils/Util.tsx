declare const __PRIVACY_LAST_UPDATED__: string;
declare const __TERMS_LAST_UPDATED__: string;

export function getPrivacyLastUpdated(): string {
  return __PRIVACY_LAST_UPDATED__;
}

export function getTermsLastUpdated(): string {
  return __TERMS_LAST_UPDATED__;
}

export function linkifyEmail(text: string) {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = text.split(emailRegex);
  return parts.map((part, i) =>
    emailRegex.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="text-gray-900 underline underline-offset-2 hover:opacity-70"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
