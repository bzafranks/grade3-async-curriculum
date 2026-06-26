# PROJECT SPEC — Grade 3 Asynchronous Curriculum: Interactive Learning Experience

> **Portable rebuild spec.** Hand this file to any Claude (or any developer) and it contains
> everything needed to understand, reopen, continue, or fully rebuild the project from scratch.
> No access to the original machine or chat is required.

---

## 1. One-line summary
A polished, portfolio-ready **static website** that reimagines Grade 3 English Language Arts
"hole-filling" lessons as a complete **asynchronous online curriculum** with interactive
components, designed for three audiences at once: **independent students, supporting parents,
and reviewing teachers.**

## 2. Goal / purpose
Demonstrate end-to-end curriculum and instructional-design skill by building a real, usable
learning experience a Grade 3 student can complete **without a teacher present**. It is an
**educator portfolio piece**.

## 3. Skills the project must showcase
Curriculum design · Standards alignment (Common Core ELA, Grade 3) · Digital/online learning
design · Interactive lesson development · Assessment design · Differentiation · Student engagement.

## 4. Tech stack & constraints
- **Pure static site:** HTML5 + CSS3 + **vanilla JavaScript**. No frameworks, no build step,
  no dependencies, no server.
- **Persistence:** browser `localStorage` only (progress trackers + saved reflections).
- **Hosting target:** GitHub Pages (deploy from `main` branch, `/root`).
- **Must run by double-clicking `index.html`** (also works via `python -m http.server`).
- **Accessibility:** responsive (desktop + mobile), keyboard support, skip link,
  `prefers-reduced-motion` support, feedback uses **color + text** (never color alone).
- **Design:** clean, professional, child-friendly. Warm but professional palette, large
  readable fonts, cards for modules, pill buttons, subtle animations only.

## 5. File structure (all files live in repo root)
```
grade3-async-curriculum/
├── index.html               # Home
├── curriculum-overview.html # Rationale, scope & sequence, pacing, guidance
├── modules.html             # 4 fully interactive modules (the centerpiece; each embeds its lesson video)
├── assessments.html         # Formative, summative, rubric, self-assessment, feedback
├── case-study.html          # Portfolio case study
├── style.css                # Design system + all styling
├── script.js                # All interactive component logic
├── README.md                # Project readme (purpose, how to view/publish/customize)
├── PROJECT_SPEC.md          # THIS FILE
└── assets/                  # Optional images/screenshots (.gitkeep placeholder)
```

## 6. Design system (defined in `style.css` `:root`)
- `--color-primary: #2f6f8f` (teal-blue), `--color-primary-dark: #235569`
- `--color-accent: #f5a623` (amber), `--color-accent-dark: #d98c10`
- `--color-coral: #ef6f6c`, `--color-leaf: #4caf82` (success green)
- `--color-bg: #fdfaf5` (soft cream), `--color-surface: #ffffff`
- Body font: "Segoe UI"/Helvetica/Arial; Heading font: "Trebuchet MS"/Segoe UI/Verdana
- Radii: 8/14/22px. Max content width: 1080px.
- Shared components: sticky header nav (mobile hamburger toggle), hero, `.card`/`.grid`,
  `.btn`/`.btn.secondary`, `.badge`, `.callout` (.tip/.note), `details.module` accordions,
  `.lesson-block` (tint variants), `.site-footer`, fade-up on scroll (`data-fade`).

## 7. Page-by-page content requirements

### index.html (Home)
Hero (title + tagline), Project Overview (target grade = Grade 3, learning model =
asynchronous, curriculum purpose), **Skills Demonstrated** cards (7 skills above),
"Built for Three Audiences" (independent student / supporting parent / reviewing teacher),
CTA section. Nav + footer on every page.

### curriculum-overview.html
Curriculum rationale · Grade-level learner profile (reader/writer/thinker/digital learner) ·
Scope & sequence table (8 modules; modules 1–4 = "Sample built", 5–8 = "Planned") ·
6-part module structure · suggested pacing table (Mon–Fri, ~20–30 min/day) · subject areas ·
learning outcomes · materials needed · parent & teacher guidance callouts.

### modules.html (CENTERPIECE)
4 module jump-cards, then **4 full modules** as `<details class="module">` accordions.
**Every module must contain all of:** Essential Question · Learning Objectives ·
**🎬 embedded lesson video** (the video-player component, placed after the objectives) ·
Key Vocabulary (as flashcards) · Mini-Lesson · Guided Practice · Independent Practice ·
Interactive Activity · Formative Assessment · Reflection prompt · Extension Activity ·
Accessibility & Differentiation notes · a per-module progress tracker.
Each module is a 6-slide animated video built with the video-player component (one per module,
the only copy — no standalone gallery page). Narration prefers a clear, young female English
voice and follows the user's rules: no "dash"-spelled suffixes, no "now take the quiz" outros —
each ends on the lesson content itself.

**The 4 modules (original content; CCSS-aligned):**
1. **Word Detectives** — abstract & concrete nouns — `CCSS.ELA-LITERACY.L.3.1.a`
2. **Matching Masters** — pronoun–antecedent agreement — `L.3.1.f`
3. **Reading Between the Lines** — literal vs. nonliteral language (idioms) — `L.3.5.a`
4. **Opinion Architects** — structuring opinion writing (intro + reasons) — `W.3.1.a`

### assessments.html
Assessment philosophy (formative/summative/self) · formative examples table + a live demo
quiz · **Summative task: "My Strong Opinion" writing project** (integrates all 4 module
skills) · **4-point rubric** (rows: opinion intro, reasons, abstract noun, pronoun agreement,
nonliteral language; /20 total) · student self-assessment "I Can" checklist (progress tracker)
+ reflection · parent/teacher feedback guide ("Glow / Grow / Ask").

### case-study.html
Written as a professional portfolio case study: at-a-glance cards (role/audience/format/
deliverable) · Problem/Challenge · My Design Solution · Instructional Design Approach
(Backward Design, Gradual Release I-do/we-do/you-do, UDL, chunking/cognitive load) ·
How asynchronous needs were addressed · How engagement was built in · How assessment &
feedback were embedded · Tools used · Reflection & future improvements.

## 8. Interactive components (all in `script.js`, initialized on DOMContentLoaded)
Each self-initializes from markup. Conventions:

| Component | Markup hook | Key attributes |
|---|---|---|
| MC quiz w/ instant feedback + score | `<div class="quiz" data-quiz>` → `.quiz-q` | `data-answer` = correct option index (0-based); optional `data-why` explanation; options are `.quiz-option` buttons; `.quiz-feedback` paragraph |
| Flip flashcards | `<div class="flashcard-deck" data-flashcards>` | `.flashcard > .flashcard-inner > .flashcard-face.flashcard-front` + `.flashcard-back`; prev/next + counter auto-built; keyboard-flippable |
| Fill-in-the-blank + "Check" | `<div class="fitb" data-fitb>` | inputs use `data-accept="a|b|c"` (pipe-separated, case-insensitive); a `[data-check]` button; `.fitb-feedback` |
| Drag-and-drop matching | `<div class="dnd" data-dnd>` | `.drag-item[draggable][data-key]` matched to `.drop-zone[data-key]`; **tap-to-match fallback** for touch |
| Progress tracker (saved) | `<div class="progress-tracker" data-progress="UNIQUE_ID">` | checkboxes inside `.progress-checklist`; `.progress-fill` bar; persists to `localStorage` key `g3curriculum:<id>` |
| Reflection box (saved) | `<div class="reflection" data-reflection="UNIQUE_ID">` | `<textarea>` + `[data-save]` button; persists to `g3reflection:<id>` |
| Word-scramble game | `<div class="game" data-game='["word1","word2"]'>` | JSON word list; `.game-scrambled`, input, `[data-guess]`, `[data-skip]`, `.game-feedback`, `.game-score` |
| Lesson video player | `<div class="video-player">` w/ `.video-stage` of `.video-slide[data-narration][data-duration]` | Animated slideshow; captions in `.video-caption`; controls `[data-play/prev/next/restart/sound]`; `.video-progress-fill`, `.video-counter`. Uses Web Speech API for narration (captions always shown; auto-falls back to timed advance when speech unavailable/off); only one player speaks at a time |
| Mobile nav | `.nav-toggle` + `.nav-links` | toggles `.open` |
| Active nav highlight | nav links | matches current filename |
| Fade-in on scroll | any element with `data-fade` | IntersectionObserver |

**Important:** every `data-progress` and `data-reflection` value must be **unique** across the
whole site or saved state collides.

## 9. Content rules
- All curriculum content is **original**, age-appropriate Grade 3 language. **No copyrighted
  textbook content.** Inspired by the *idea* of skill-gap ("hole-filling") practice, rewritten
  and expanded into portfolio-ready material.
- Each module's content feeds the summative "My Strong Opinion" task (the 4 skills combine there).

## 10. How to preview
- Double-click `index.html`, **or** `python -m http.server 8000` then open `http://localhost:8000`.

## 11. How to deploy (GitHub Pages)
1. Create repo `grade3-async-curriculum`; push files to repo **root** on branch `main`.
2. GitHub → Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)` → Save.
3. Live at `https://<username>.github.io/grade3-async-curriculum/`.

## 12. Status & possible next steps
- **Done:** all 8 files complete; 4 modules fully interactive; assessment system; case study; README.
- **Not yet done / future ideas:** audio narration of mini-lessons; build modules 5–8 for a
  full-year sequence (5. Sentence Builders L.3.1.i, 6. Context Clue Crew L.3.4.a,
  7. Story Makers W.3.3, 8. Fact Finders W.3.2/W.3.8); lightweight teacher dashboard
  (exportable progress); usability test with real students; multilingual supports.

---
*To rebuild from zero: follow sections 4–9 exactly. The only external requirement is a web
browser. Everything else is self-contained in the listed files.*
