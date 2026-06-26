# Grade 3 Asynchronous Curriculum: Interactive Learning Experience

A polished, portfolio-ready curriculum design project that reimagines a set of Grade 3
English Language Arts lessons as a complete **asynchronous online curriculum** with
interactive components. It is built to work for three audiences at once: **independent
students, supporting parents, and reviewing teachers.**

This is a static website — pure HTML, CSS, and JavaScript — ready to deploy on GitHub Pages.

---

## ✨ Project Purpose

To demonstrate end-to-end curriculum and instructional design skill by building a real,
usable learning experience that a Grade 3 student can complete **without a teacher present**.
It showcases:

- Curriculum design & coherent scope and sequence
- Standards alignment (Common Core ELA, Grade 3)
- Digital / online learning design
- Interactive lesson development
- Assessment design (formative, summative, self-assessment)
- Differentiation & accessibility
- Student engagement strategy

---

## 🧩 Features

- **5 pages:** Home, Curriculum Overview, Modules, Assessments, and a Portfolio Case Study.
- **4 fully built interactive modules**, each with an essential question, objectives, key
  vocabulary, mini-lesson, guided & independent practice, an interactive challenge, formative
  assessment, reflection, extension, and accessibility/differentiation notes.
- **Interactive components** (all vanilla JavaScript, no dependencies):
  - Multiple-choice quizzes with instant feedback and scoring
  - Drag-and-drop vocabulary matching (with a tap-to-match fallback for touch devices)
  - Fill-in-the-blank practice with "Check your answer" buttons
  - Interactive flip flashcards
  - Progress trackers with progress bars (saved to the browser)
  - Reflection response boxes (saved to the browser)
  - A word-scramble challenge game
  - **Animated lesson videos** — a self-contained slideshow player with synchronized
    captions and optional browser narration (Web Speech API), one embedded in each module
    (narration prefers a clear, young-sounding female English voice when available)
- **Assessment system:** formative examples, a summative writing task, a 4-point rubric,
  a student self-assessment checklist, and a parent/teacher feedback guide.
- **Responsive, accessible design:** mobile-friendly layout, keyboard support, skip link,
  reduced-motion support, and color-plus-text feedback (never color alone).

---

## 👀 How to View the Site

### Option 1 — Open locally (quickest)
Just double-click `index.html`. It opens in your browser and everything works, including the
interactive activities and saved progress.

### Option 2 — Run a local web server (recommended for an exact preview)
From the project folder, run one of these and then visit the URL it prints:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000

# or, if you have Node.js
npx serve
```

---

## 🚀 How to Publish with GitHub Pages

1. Create a new repository on GitHub (e.g. `grade3-async-curriculum`).
2. Upload all the files in this folder to the repository (keep the file names the same and
   keep them in the repository root).
   ```bash
   git init
   git add .
   git commit -m "Add Grade 3 Asynchronous Curriculum portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/grade3-async-curriculum.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
6. Wait about a minute. Your site will be live at:
   `https://<your-username>.github.io/grade3-async-curriculum/`

That URL is shareable on your résumé, LinkedIn, or portfolio.

---

## ✏️ How to Customize Lessons

The site is intentionally easy to edit by hand.

### Add or change a quiz question
In `modules.html`, copy a `.quiz-q` block. Set `data-answer` to the index of the correct
option (**0 = first button, 1 = second, ...**) and optionally add a `data-why` explanation:

```html
<div class="quiz-q" data-answer="1" data-why="Because the second choice is correct.">
  <p class="q-text">Your question?</p>
  <div class="quiz-options">
    <button class="quiz-option">Choice A</button>
    <button class="quiz-option">Choice B (correct)</button>
  </div>
  <p class="quiz-feedback" aria-live="polite"></p>
</div>
```

### Add a flashcard
Inside a `.flashcard-deck` add:

```html
<div class="flashcard"><div class="flashcard-inner">
  <div class="flashcard-face flashcard-front">word</div>
  <div class="flashcard-face flashcard-back">meaning</div>
</div></div>
```

### Edit fill-in-the-blank answers
Set `data-accept` to a pipe-separated list of accepted answers (case-insensitive):

```html
<input type="text" data-accept="wait|be patient|slow down">
```

### Change the word game
Edit the JSON list in the `data-game` attribute:

```html
<div class="game" data-game='["opinion","reason","topic"]'> ... </div>
```

### Add a new module
Copy an entire `<details class="module"> … </details>` block in `modules.html`, change the
text, and give its progress tracker a **unique** `data-progress` value and reflection a unique
`data-reflection` value so saved data doesn't collide.

### Change colors / fonts
All design tokens live at the top of `style.css` under `:root` — edit the color and font
variables in one place to re-skin the whole site.

---

## 🛠️ Technologies Used

| Technology | Role |
|---|---|
| **HTML5** | Semantic structure and content |
| **CSS3** | Custom design system, Flexbox & Grid, responsive layout, animations |
| **Vanilla JavaScript** | All interactivity (no frameworks, no build step) |
| **localStorage** | Saving progress and student reflections on the device |
| **GitHub Pages** | Free static hosting |

No frameworks, no dependencies, and no build step — the project runs straight from the files.

---

## 📁 File Structure

```
grade3-async-curriculum/
├── index.html               # Home page
├── curriculum-overview.html # Rationale, scope & sequence, pacing, guidance
├── modules.html             # 4 fully interactive modules (each with an embedded lesson video)
├── assessments.html         # Formative, summative, rubric, self-assessment, feedback
├── case-study.html          # Professional portfolio case study
├── style.css                # Design system & all styling
├── script.js                # All interactive component logic
├── assets/                  # (Optional) place for images/screenshots
└── README.md                # This file
```

---

## 🎓 Portfolio Relevance

This project is designed to be a centerpiece of an educator / instructional-design portfolio.
It provides concrete evidence of the ability to:

- Translate standards into engaging, age-appropriate learning experiences.
- Apply instructional design frameworks (Backward Design, Gradual Release, UDL).
- Design for self-directed, asynchronous learning where no teacher is present.
- Build interactive digital learning content from scratch.
- Embed meaningful assessment and feedback throughout a curriculum.
- Ship and share a finished, professional product.

The **Case Study page** narrates the design thinking behind the project, making it
interview- and review-ready.

---

## 📄 Content Note

All curriculum content in this project is **original** and written for demonstration purposes.
It is inspired by the *idea* of targeted skill-gap ("hole-filling") practice but rewritten and
expanded into portfolio-ready material. No copyrighted textbook content is used.
