# Landing page screenshots

`AppGallery` renders these three files. Any that are missing falls back to its
illustration in `src/components/PaperArt.tsx`, so the section always looks
complete — dropping a file in simply replaces the drawing with the real thing.

| File            | Screen to capture              |
| --------------- | ------------------------------ |
| `write.png`     | `/write` — the compose page    |
| `diaries.png`   | `/diaries` — the reading list  |
| `postcard.png`  | `/postcards` — the card front  |

Capture at a 16:10-ish window (1440×900 works well); the frames crop from the top.
Keep them under ~400KB each — they are served uncompressed from `public/`.
