# CLAUDE.md: handoff for the Kira Forex sample

## What this is
A pitch sample for Lamidi Sikira (Kira Forex), a Ghanaian forex trader and mentor with an international audience. Static HTML/CSS/JS with no build step; it works from `file://` and from `OPEN-WEBSITE.bat`. Do not push or deploy unless the user asks.

## Concept
"She is the I." KIRA is set as a monument across the hero in Bodoni Moda. The I is a rose-quartz candle body with champagne wicks, and her full-length cut-out stands in it, leaning on the K. Behind it, `hero3d.js` renders the last 64 real gold sessions (COMEX futures) as beveled glass candles: emerald glass for up days, rose quartz for down days. They stand in front of a slowly moving procedural malachite backdrop with gold dust. The candle is the motif everywhere: the page curtain is a candle opening across the screen, the slips are trade slips, and the academy path is rising candles.

## Design system
- **Palette** (`:root` in `assets/css/style.css`): malachite `#062a20` (and steps), deep `#03190f`, rose quartz `#e8b9b0` / blush `#f1d3cc`, pearl `#f3eff0` (cool, deliberately not cream), paper, champagne `#dcc391` (wicks and light only), emerald `#2f9e74` (bull glass, live dots).
- **Sections** carry `data-tone` (`pearl`, `paper`, `rose`, `blush`, `malachite`, `deep`), which sets `--bg`, `--fg` and `--accent`. Neighbouring sections never share a tone. The nav reads the tone under it.
- **Type:** Bodoni Moda (display, optical sizing on) and Jost (text). Five steps: `--step-small`, `--step-body`, `--step-lead`, `--step-head`, `--step-poster`, plus monument sizes in vw. No eyebrows, no monospace, no numbering.
- **Glass** is a material, not a theme: the nav, the slip console, chips, the ticker, the desk and the checkout summary. Pointer light on `.glass::after`.
- **Motion:** GSAP + ScrollTrigger + Lenis, vendored. `[data-reveal]`, `[data-split]` (word rise), `[data-magnetic]`, `[data-tilt]`. Lenis is off under `navigator.webdriver` (automation) and for reduced motion. `?pose=1` freezes everything.

## Architecture
- `assets/js/data.js` (`window.KF`) holds all content. The gold rows and exchange rates are real; prices, courses and tour dates are sample (see README).
- `assets/js/site.js` (`window.KFUI`) is the shell: nav, drawer, footer (`<div data-footer>`), curtain, Lenis, reveals, currency (`UI.money`, `UI.setCcy`, `.ccy`), trading sessions (`UI.sessions()`, DST-safe via Intl) and toasts.
- Home-only scripts: `hero3d.js` (three.js r149 UMD, WebGL fallback to SVG) and `home.js` (intro, scroll scenes, section content).
- Shared scripts:
  - `slip.js`: the trade calculator. Lots = risk money / (stop pips × pip value), rounded down to 0.01.
  - `desk.js`: the rule-based concierge.
  - `store.js` (`window.KFStore`): the localStorage db `kf.db.v2`. Seeded sample data, reseeded daily; own orders, applications, journal and setups are kept.
  - `inner.js`: the logic for every inner page, keyed by `body[data-page]`.
  - `globe3d.js`: the tour globe. Land is a Natural Earth bitmask embedded in the script.
  - `admin.js` + `assets/css/admin.css`: Kira HQ.
- Images: `assets/img/full` + `thumb`. WebGL never loads image files (file:// would taint them). Textures are procedural or canvas-made.

## Gotchas
- The hero monument size is `min(37.2vw, (100svh - 290px)/1.05)`; check 1280×646 after any hero change.
- The cut-out's arm end is hidden behind the K (`.l--k` z-index 4). Keep that if you move her.
- Use `minmax(0,1fr)` for grid columns. `[hidden]` is forced to `display:none`.
- Never collect card numbers; checkout is simulated. Keep risk warnings next to offers, not only in the footer.
- QA in real headless Chrome (Playwright): the hidden browser pane pauses rAF.
