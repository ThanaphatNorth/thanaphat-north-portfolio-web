# Generated media (Higgsfield) — 2026-09-28

All scene imagery is AI-generated atmosphere; project screenshots and personal data are real.
Files live in `public/media/`. Re-encode with ffmpeg/sharp settings noted below.

| File | Source job | Model | Settings | Prompt (gist) |
|---|---|---|---|---|
| `hero/skyline.{avif,webp}` (+`-1440`) | `f504cc06` | Cinema Studio Image 2.5 | 21:9 · 2k | Bangkok-inspired skyline at blue hour, slender spire right of centre, empty sky upper third. **Re-registered into the video frame** (scale 0.99, offset −5/−11 px @2560w) so it aligns with the scrub/loop. |
| `hero/blueprint.{avif,webp}` | first frame of `534fd264` | (from video) | 2206×946 | Blueprint twin; taken from the transition video so it aligns exactly. Original still: Seedream 4.5 `966fa04d` with A1 as reference. |
| `frames/hero/f_001…071.webp` | `534fd264` | Seedance 2.5 omni-reference | 5 s · 1080p · 21:9 · start=blueprint, end=skyline · locked-off camera | Blueprint materializes floor by floor into the real city. `ffmpeg -vf fps=14,scale=1280:-2 -c:v libwebp -quality 62` |
| `hero/tower.webp` | bg-removal `76bc0a47` of A1 | image_background_remover | alpha, bottom 20 % faded | Foreground spire for the text-behind-object effect (re-registered like the skyline). |
| `loops/hero-loop.{webm,mp4}` | `87e0a5ac` | Seedance 2.5 | 6 s · 720p · start=end=A1 | Haze drift, flickering windows, blinking beacon. VP9 crf 38 / H.264 crf 26. |
| `scenes/first-light.*`, `loops/first-light.*` | still `0cdabf1a` (Soul Cinema), loop `d301a138` | Soul Cinema → Seedance 2.5 | 16:9 · 6 s · 720p | Pre-dawn ridges, North Star fading. |
| `scenes/summit.*`, `loops/summit.*` | still `0ea451fc` (Cinema Studio 2.5 ref A1), loop `cdda235a` | Cinema Studio 2.5 → Seedance 2.5 | 16:9 · 6 s · 720p | Sunrise behind the same spire from a rooftop. |
| `og-skyline.jpg` | A1 | — | 1200×630 cover crop | Background for `/opengraph-image`. |

Credits used: ≈ 200 in total (balance 248 → 47.9); videos were 60 (1080p) + 3 × 35 (720p), the rest stills / background removal.
