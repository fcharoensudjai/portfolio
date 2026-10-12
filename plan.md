# portfolio redesign — brainstorm & plan

> branch: `design` · status: thinking, no code yet

## 1. what we're solving

- home feels plain — the recents section is two near-identical image+text rows
- the nav mixes *pages* and *scroll-sections* and you can't tell which is which
- want it to be **expressive** — a site that showcases frontend *and* design skill
- want it to **start with who i am + why this site exists**, then go into work
- keep the existing design system — the palette/type/motifs *are* the thinking

## 2. guardrails (do not break)

- **palette frozen** — cream `#FEFBFB`, charcoal `#242424`/`#403B3B`, rose `#DDA6A6`/`#CD7A7A`, sand `#BFAF9C`. no new colours.
- **type stays** — Poppins (display) + Roboto Mono (copy) on the 1.25 scale
- **mono is the voice** — the "wall of mono" is intentional; the fix is *staging*, not the font
- **scramble stays as the reveal language** — reveal-on-enter, hover-on-interactive
- **two interaction patterns are intentional** — click the art *or* click "more detail"
- **transition is one gesture** — swipe up → scrambly destination word → swipe out. keep it
- **only 2 flagship pieces** = a diptych, not a grid. no filler pieces
- **texture must be invisible-on-purpose** — if you can name it, it's too loud
- **one scroll-linked move per act** — cinematic reads through scale + empty space, not motion

## 3. the narrative arc (the big idea)

the site as a story, in order:

1. **cover / manifesto** — who i am, why this site exists (one breath)
2. **recents spotlight** — the flagship work, a two-act piece
3. **gallery** — the full body of work (archive)
4. **about** — the longer "who i am" story
5. **contact** — footer / section

this order is the design decision that everything else hangs off.

## 4. information architecture — the open question

current: `home` (intro hero + recents) · `gallery` · `about` · `recents/[id]` · contact repeated on every page.

| option | shape | feel | trade-off |
|---|---|---|---|
| **A. home as hub** | home = cover + recents spotlight + teaser to gallery/about. gallery + about are pages | keeps the multi-page structure, keeps the page transitions | the most clicks |
| **B. one scroll journey** | everything on one long page, gallery becomes a section | immersive, no navigation friction | kills the page transitions we like |
| **C. cover page** | home = pure manifesto cover, everything else on pages | most editorial, most "brand" | recents lives behind one more click |

**leaning:** A, with a sicker cover. home = *cover + recents spotlight* (scroll from the cover straight into the work), gallery + about as pages. the page transitions stay.

open sub-question: does "recents" stay a home section, or become its own page? (right now it's a home section, with per-piece detail pages at `/recents/[id]`.)

## 5. the intro (cover / manifesto)

currently the home intro is just the name + "[ scroll to explore ]". it never says *why this site exists*.

**duplication watch:** the about page already holds this — its "this site" panel is the manifesto ("this site is my creative outlet..."). so a home manifesto line and that panel would say the same thing twice.

proposal: the cover owns the *thesis* (one line), about owns the *person* (the long story). trim or rework about's "this site" panel so nothing's said twice.

**needs from fasai:** the unified, not contrasted

fasai's call: the two pieces are both recent works and should feel like siblings, not two different vibes. drop the "two contrasting compositions" idea.

one spotlight treatment, applied to both:
- image-led full-bleed panels, bigger type overlapping the art, mono caption, "more detail" button
- both share the same anatomy; the only variation is light alternation (image side / accent) so it never reads as a repeated list

open: subtle alternation vs fully identical. and whether to add a single shared scroll reveal (clip or scale) to both.) *is* the interest

**needs from fasai:** act 02 composition — sticky split or scale-from-crop?

## 7. nav redesign

current: `recents` (→ /#recents) · `gallery` (/gallery) · `intro` (→ /#intro) · `about` (/about) · `contact` (→ /#contact)

problems:
- "intro" isn't a destination — it's "top of home", and the logo already does that
- anchors and pages look identical, so you can't tell which scrolls vs navigates
- active-state underlining (the three visibility contexts) is meaningless off home

proposal:
- nav = **recents** · **work** (gallery) · **about** — home lives in the logo
- **dotted underline = scrolls on this page, solid underline = goes to a page** (the dotted rule is already in the system)
- drop "intro"; move "contact" to footer/socials

**needs from fasai:** confirm drop "intro" + "contact", confirm dotted/solid distinction.

## 8. texture & dark mode

dark = the default (warm charcoal). currently flat — make it physical:

- **grain layer** — fixed full-screen SVG fractal noise, `pointer-events-none`, `mix-blend-mode: overlay` (dark) / `soft-light` (light), 2–4% opacity. no asset, no dependency
- **warm gradient** on the charcoal instead of uniform `#242424` (slightly warmer toward the bottom)
- **blush glow** behind featured images in dark mode (`#CD7A7A` ~5% blurred radial) so art sits *in* light

## 9. transitions

keep the one-gesture swipe. optional polish (low priority vs recents):
- carry the destination word more prominently mid-wipe
- split-panel wipe instead of single curtain

## 10. proposed build order (once locked)

1. grain/texture layer — cheap, high impact
2. nav restructure + dotted/solid
3. intro manifesto line
4. recents two-act rebuild
5. (optional) transition polish

## 11. what we're NOT changing

palette · fonts · type scale · motifs (caret, petal, corner brackets, dotted rules) · mono voice · two-click patterns · scramble-as-reveal · the preloader/exit gesture
