# Copy style

Two registers. Each string is one or the other — never a mix.

## Labels → lowercase

Navigation, page titles, card names, section headings, buttons, eyebrows, preloader text, prompts.

- No terminal punctuation.
- No exceptions for proper nouns or character names: `raiden shogun`, `yor forger`, `makima (train scene)`.
- Examples: `gallery`, `about`, `recent works`, `from the gallery`, `see the gallery`, `more detail`, `view my gallery`, `[ scroll to explore ]`, `[ mail | fuzz.ch04@gmail.com ]`

## Prose → sentence case

Descriptions, captions, intros, bios — anything that reads as a sentence.

- Capital first letter, terminal full stop (or `!` / `?`).
- Proper nouns get their real capitalisation here: `Raiden Shogun`, `Genshin Impact`, `League of Legends`, `Procreate`.
- Examples: the about statement, the gallery intro, the recents section intro, artwork descriptions, the gallery carousel caption.

## Exception

`get in touch!` keeps its exclamation mark. It is the only emotional beat on the contact CTA — deliberate, don't "fix" it.

## Why

Lowercase is a display voice; it gives the chrome its personality. Run it through a paragraph and it stops reading as a style choice and starts reading as a bug — the eye slows down, and a five-line artist statement looks like an unset `text-transform`.

So: the same two words can legitimately appear in both cases on one screen — `raiden shogun` as a card title, `Raiden Shogun` in the description beneath it.

## Where the copy lives

| Copy                          | File                                             |
| ----------------------------- | ------------------------------------------------ |
| Page intros, section copy     | `src/app/page.tsx`, `src/app/(pages)/*/page.tsx` |
| About paragraphs              | `src/app/(pages)/about/about-data.ts`            |
| Artwork titles / descriptions | `src/app/(pages)/recents/[id]/artworks.ts`       |
| Home recents teasers          | `src/components/home/recents-stage.tsx`          |
| Gallery card names            | `src/components/card/imageData.ts`               |
| Carousel label / caption      | `src/components/home/gallery-carousel.tsx`       |
| Contact CTA                   | `src/components/contact.tsx`                     |

Spelling is British throughout: favourite, colour, organised, recognise.
