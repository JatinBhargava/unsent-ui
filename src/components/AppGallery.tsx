import { useState } from "react";

import { DiariesArt, PostcardArt, WritingArt } from "./PaperArt";

/**
 * A look at what the app makes. Each frame shows a real screenshot once one is
 * dropped into `public/screenshots/`, and falls back to its illustration until
 * then — so the section is never empty and never shows a broken image.
 */
const shots = [
  {
    src: "/screenshots/write.png",
    alt: "The writing page, with a title field, formatting controls and a Public toggle",
    title: "Write it down first",
    caption:
      "Give it a title and start. Save it as a draft while you decide, and keep it private or publish it — the toggle sits on every page.",
    Art: WritingArt,
  },
  {
    src: "/screenshots/diaries.png",
    alt: "The diaries page, a grid of published entries by different writers",
    title: "Read what people left open",
    caption:
      "Pages other writers chose to share, filtered by author or by whether they are public. Add a page of your own if one speaks to you.",
    Art: DiariesArt,
  },
  {
    src: "/screenshots/postcard.png",
    alt: "The postcard composer, showing the addressed front of a card",
    title: "Post one to a person",
    caption:
      "Address the front, turn it over, write the bit you actually mean. It reaches their inbox as a sealed envelope they open in the browser.",
    Art: PostcardArt,
  },
];

export default function AppGallery() {
  const [missing, setMissing] = useState<string[]>([]);

  return (
    <div className="mt-16">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        Three ways in
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-600">
        Somewhere to put the thought, somewhere to read everyone else&apos;s, and a way
        to send one to the person it was about.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map(({ src, alt, title, caption, Art }) => (
          <figure
            key={src}
            className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 shadow-[0_14px_40px_-24px_rgba(60,45,40,0.6)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-24px_rgba(60,45,40,0.65)]"
          >
            <div className="flex items-center gap-1.5 border-b border-gray-200/70 bg-white/70 px-4 py-2.5">
              <span className="size-2 rounded-full bg-[#e8c6bd]" />
              <span className="size-2 rounded-full bg-gray-200" />
              <span className="size-2 rounded-full bg-gray-200" />
            </div>

            {missing.includes(src) ? (
              <Art className="aspect-[16/10] w-full" />
            ) : (
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                // reserved so the page does not jump as each capture loads
                className="aspect-[16/10] w-full bg-[#f6f2ee] object-cover object-top"
                onError={() => setMissing((current) => [...current, src])}
              />
            )}

            <figcaption className="px-5 py-4 text-left">
              <p className="font-serif text-base text-[#2f2724]">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
