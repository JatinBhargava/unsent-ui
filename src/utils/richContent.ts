import DOMPurify from "dompurify";

export const RICH_WRAPPER_ATTR = "data-unsent-rich";
export const RICH_FONT_ATTR = "data-unsent-font";

export interface FontOption {
  id: string;
  label: string;
  fontFamily: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "sans", label: "Default", fontFamily: "inherit" },
  { id: "serif", label: "Serif", fontFamily: "Georgia, 'Times New Roman', serif" },
  { id: "mono", label: "Mono", fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" },
  { id: "elegant", label: "Elegant", fontFamily: "'Playfair Display', Georgia, serif" },
  { id: "handwritten", label: "Handwritten", fontFamily: "'Caveat', cursive" },
];

export const DEFAULT_FONT_ID = "sans";

export function getFontFamily(fontId: string): string {
  return FONT_OPTIONS.find((f) => f.id === fontId)?.fontFamily ?? "inherit";
}

// Tags/attrs the in-editor toolbar is ever allowed to produce.
const INNER_ALLOWED_TAGS = ["b", "i", "u", "br"];

// Sanitize just the editable body (no wrapper) — used before saving.
export function sanitizeEditableHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: INNER_ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  });
}

// Wraps sanitized inner HTML + a font choice into a single storable string.
export function buildRichContent(innerHtml: string, fontId: string): string {
  const safeInner = sanitizeEditableHtml(innerHtml);
  const fontFamily = getFontFamily(fontId).replace(/"/g, "'");
  return `<div ${RICH_WRAPPER_ATTR}="1" ${RICH_FONT_ATTR}="${fontId}" style="font-family:${fontFamily}">${safeInner}</div>`;
}

export function isRichContent(content: string): boolean {
  return content.trimStart().startsWith(`<div ${RICH_WRAPPER_ATTR}`);
}

// Full document-level sanitize used whenever rich content is rendered to a
// reader — content may have reached the backend via a raw API call that
// never passed through our editor, so this can't assume it's already safe.
export function sanitizeForDisplay(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["div", "b", "i", "u", "br"],
    ALLOWED_ATTR: ["style", RICH_FONT_ATTR],
  });
}

export function parseRichContent(content: string): { innerHtml: string; fontId: string } {
  if (!isRichContent(content)) {
    return { innerHtml: "", fontId: DEFAULT_FONT_ID };
  }
  const doc = new DOMParser().parseFromString(sanitizeForDisplay(content), "text/html");
  const wrapper = doc.querySelector(`div[${RICH_WRAPPER_ATTR}]`);
  if (!wrapper) return { innerHtml: "", fontId: DEFAULT_FONT_ID };

  const fontId = wrapper.getAttribute(RICH_FONT_ATTR) || DEFAULT_FONT_ID;
  return { innerHtml: wrapper.innerHTML, fontId };
}

export function getPlainText(content: string): string {
  if (!isRichContent(content)) return content;
  const { innerHtml } = parseRichContent(content);
  const container = document.createElement("div");
  container.innerHTML = innerHtml;
  return container.textContent || "";
}
