/**
 * Illustrations for the landing gallery, drawn in the postcard palette so the
 * page looks finished before real screenshots exist. Inline SVG rather than
 * stock photography: nothing to download, nothing to license, and the colours
 * stay in step with the rest of the product.
 *
 * All three are decorative — the figcaption beside them carries the meaning.
 */

const INK = "#2f2724";
const BLUSH = "#f4dcd5";
const BLUSH_DEEP = "#eac7bd";
const ROSE = "#c4576b";
const RULE = "#efe4de";
const PAPER = "#f6f2ee";

type ArtProps = { className?: string };

/** A sheet part-written, with the pen still on it. */
export function WritingArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden="true">
      <rect width="320" height="200" fill={PAPER} />
      <g transform="rotate(-3 160 100)">
        <rect x="78" y="24" width="164" height="164" rx="8" fill="#fff" stroke={RULE} />
        {[54, 76, 98, 120, 142].map((y, index) => (
          <rect
            key={y}
            x="98"
            y={y}
            width={index === 4 ? 60 : index === 2 ? 108 : 124}
            height="5"
            rx="2.5"
            fill={index < 3 ? "#d8cec8" : RULE}
          />
        ))}
        <circle cx="106" cy="40" r="4" fill={ROSE} opacity="0.5" />
      </g>
      {/* the pen, resting across the lower corner */}
      <g transform="rotate(34 226 150)">
        <rect x="196" y="146" width="86" height="9" rx="4.5" fill={INK} />
        <path d="M282 146 L296 150.5 L282 155 Z" fill={BLUSH_DEEP} />
        <rect x="206" y="146" width="7" height="9" fill={ROSE} opacity="0.8" />
      </g>
    </svg>
  );
}

/** Several published pages, fanned the way a reading list stacks up. */
export function DiariesArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden="true">
      <rect width="320" height="200" fill={PAPER} />
      {[
        { rotate: -9, x: 60, fill: "#fffdf8", opacity: 0.9 },
        { rotate: 4, x: 88, fill: "#fff", opacity: 1 },
      ].map((sheet) => (
        <g key={sheet.rotate} transform={`rotate(${sheet.rotate} 160 104)`} opacity={sheet.opacity}>
          <rect x={sheet.x} y="34" width="150" height="140" rx="8" fill={sheet.fill} stroke={RULE} />
        </g>
      ))}
      {/* the page on top, the one being read */}
      <g transform="rotate(-2 160 104)">
        <rect x="74" y="28" width="164" height="150" rx="9" fill="#fff" stroke={RULE} />
        <rect x="94" y="52" width="72" height="7" rx="3.5" fill={INK} opacity="0.75" />
        {[74, 94, 114, 134].map((y, index) => (
          <rect
            key={y}
            x="94"
            y={y}
            width={index === 3 ? 78 : 124}
            height="5"
            rx="2.5"
            fill="#ded4ce"
          />
        ))}
        <rect x="94" y="154" width="40" height="5" rx="2.5" fill={BLUSH_DEEP} />
      </g>
    </svg>
  );
}

/** The envelope, card half out, sealed — the same object the email shows. */
export function PostcardArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden="true">
      <rect width="320" height="200" fill={PAPER} />
      {/* the card, tucked in behind the pocket */}
      <g transform="rotate(-2 160 96)">
        <rect x="92" y="26" width="136" height="118" rx="9" fill="#fff" stroke={RULE} />
        <rect x="110" y="46" width="30" height="5" rx="2.5" fill={BLUSH_DEEP} />
        <rect x="110" y="60" width="66" height="7" rx="3.5" fill={INK} opacity="0.75" />
        <rect x="110" y="86" width="30" height="5" rx="2.5" fill={BLUSH_DEEP} />
        <rect x="110" y="100" width="54" height="7" rx="3.5" fill={INK} opacity="0.75" />
      </g>
      {/* the envelope back and pocket */}
      <rect x="66" y="104" width="188" height="72" rx="12" fill={BLUSH_DEEP} />
      <rect x="66" y="118" width="188" height="58" rx="12" fill={BLUSH} />
      {/* the wax seal, straddling the seam */}
      <circle cx="160" cy="118" r="15" fill={ROSE} />
      <path
        d="M160 125c-4.6-3.4-7.4-5.9-7.4-9a4.2 4.2 0 017.4-2.6 4.2 4.2 0 017.4 2.6c0 3.1-2.8 5.6-7.4 9z"
        fill="#fff"
      />
    </svg>
  );
}
