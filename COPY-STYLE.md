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

## Alt text → label

Screen-reader descriptions of artwork (`drawing of raiden shogun`, `a closeup shot of a drawing of raven`).

- Lowercase, no terminal punctuation.
- Proper nouns stay lowercase here. It is a label, not prose — the surrounding page already carries the capitalised name.

## Punctuation

- **Apostrophes are straight** (`'`), not typographic (`’`). The whole codebase is straight; curly ones render inconsistently with the mono display face.
- **Dashes are spaced en dashes** (`challenging – the compressed PNG`). Not em dashes, not a spaced hyphen.
- **The serial comma is optional.** Leave it out where the list reads cleaner (`dynamic, atmospheric and incredibly epic`). Keep it where it aids the read. Consistency is per paragraph, not per site.
- **`finance` is the discipline, `Finance Strategy` is the job.** Lowercase the field, capitalise the role — both can appear in one sentence.

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
| Home manifesto                | `src/components/home/profile-sequence.tsx`       |
| Gallery card names            | `src/components/card/imageData.ts`               |
| Alt text                      | `src/components/card/imageData.ts`, `src/app/(pages)/recents/[id]/artworks.ts` |
| Carousel label / caption      | `src/components/home/gallery-carousel.tsx`       |
| Hover CTAs (`see full image`) | `src/components/card/card.tsx`                   |
| BTS labels                    | `src/components/recents/bts-stage.tsx`           |
| Not-found state               | `src/app/(pages)/recents/[id]/clientside.tsx`    |
| Preloader lines               | `src/components/stylers/page-loading/preloader.tsx` |
| Contact CTA                   | `src/components/contact.tsx`                     |

Spelling is British throughout: favourite, colour, organised, recognise.
