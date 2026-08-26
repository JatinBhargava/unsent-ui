import { useMemo, useState } from "react";

type Postcard = {
  to?: string | null;
  from?: string | null;
  message?: string | null;
};

/**
 * The postcard travels in the URL fragment rather than in a database — a fragment
 * is never sent to a server, so the link is the only copy that exists.
 */
function decodePostcard(hash: string): Postcard | null {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw) return null;

  try {
    const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    return typeof parsed === "object" && parsed !== null ? (parsed as Postcard) : null;
  } catch {
    return null;
  }
}

export default function PostcardOpen() {
  // Read once: the fragment is the payload, and it never changes under us.
  const postcard = useMemo(() => decodePostcard(window.location.hash), []);
  const [open, setOpen] = useState(false);

  if (!postcard?.message) {
    return (
      <div className="min-h-screen bg-[#f6f2ee] px-4 py-16 flex items-center justify-center">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-[#2f2724]">This postcard is empty</h1>
          <p className="mt-3 text-sm text-[#8c7168] leading-relaxed">
            The link may have been broken in half on its way here. Ask whoever sent it
            to post you another one.
          </p>
        </div>
      </div>
    );
  }

  const toName = postcard.to?.trim() || "you";
  const fromName = postcard.from?.trim() || "Someone";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f2ee] px-4 py-12 sm:py-16 flex flex-col items-center">
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-rose-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#f4dcd5]/50 blur-3xl" />

      <p className="relative z-10 text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c3aca3]">
        Unsent
      </p>

      <div className="envelope-scene relative z-10 mt-8 w-full max-w-lg">
        <div className={`envelope ${open ? "is-open" : ""}`}>
          {/* the envelope's back wall, behind everything */}
          <div className="envelope-back" />

          <div className="envelope-card">
            <div className="envelope-card-inner">
              {/* ---------- front: the address side, the half that peeks out ---------- */}
              <div className="envelope-face rounded-[18px] border border-[#f0e6e1] bg-white p-6 sm:p-8 shadow-[0_18px_50px_-20px_rgba(80,45,40,0.28)]">
                <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#c9a9a0]">To</p>
                <p className="mt-1.5 text-xl text-[#2f2724]">{toName}</p>
                <p className="mt-6 text-[9px] font-semibold tracking-[0.18em] uppercase text-[#c9a9a0]">From</p>
                <p className="mt-1.5 text-xl text-[#2f2724]">{fromName}</p>
                <div className="mt-7 space-y-3" aria-hidden="true">
                  <div className="h-px bg-[#f2e7e2]" />
                  <div className="h-px bg-[#f2e7e2]" />
                  <div className="h-px w-2/3 bg-[#f2e7e2]" />
                </div>
              </div>

              {/* ---------- back: what they actually wrote ---------- */}
              <div className="envelope-face envelope-face--back rounded-[18px] border border-[#f0e6e1] bg-white p-6 sm:p-8 shadow-[0_18px_50px_-20px_rgba(80,45,40,0.28)] flex flex-col">
                <p className="text-base text-[#8c7168]">Dear {toName},</p>
                <p className="mt-4 flex-1 overflow-y-auto whitespace-pre-wrap text-[15px] leading-[28px] text-[#2f2724]">
                  {postcard.message}
                </p>
                <p className="mt-5 text-right text-base text-[#8c7168]">— {fromName}</p>
              </div>
            </div>
          </div>

          {/* the pocket front, which the card slides up out of */}
          <div className="envelope-front" />
          <div className="envelope-seal" aria-hidden="true">
            <span>&#9829;</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="relative z-10 mt-10 rounded-full bg-[#2f2724] px-8 py-3.5 text-xs font-semibold tracking-wide text-[#fffdfa] shadow-[0_10px_28px_-12px_rgba(47,39,36,0.9)] transition-all hover:bg-[#463a35] hover:shadow-[0_14px_32px_-12px_rgba(47,39,36,0.9)]"
      >
        {open ? "Slip it back in" : "Open your postcard"}
      </button>

      <p className="relative z-10 mt-6 max-w-xs text-center text-xs leading-relaxed text-[#c3aca3]">
        This postcard lives in the link and nowhere else — we keep no copy of it.
      </p>
    </div>
  );
}
