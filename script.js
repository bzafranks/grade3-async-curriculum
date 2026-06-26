/* =====================================================================
   Grade 3 Asynchronous Curriculum — Interactive behavior
   Vanilla JS. No dependencies. Progressive-enhancement friendly.
   Each component initializes itself based on data-* attributes / classes,
   so any page can include only the components it needs.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initActiveNav();
  initQuizzes();
  initFlashcards();
  initFillInBlank();
  initDragAndDrop();
  initProgressTrackers();
  initReflections();
  initWordGames();
  initVideoPlayers();
  initFadeIn();
});

/* ---------- Mobile nav toggle ---------- */
function initNav() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

/* ---------- Highlight current page in nav ---------- */
function initActiveNav() {
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}

/* =====================================================================
   1. Multiple-choice quizzes with instant feedback
   Markup:
   <div class="quiz" data-quiz>
     <div class="quiz-q" data-answer="1">
       <p class="q-text">Question?</p>
       <div class="quiz-options">
         <button class="quiz-option">A</button>
         <button class="quiz-option">B (correct = index 1)</button>
       </div>
       <p class="quiz-feedback" aria-live="polite"></p>
     </div>
     ...
   </div>
   ===================================================================== */
function initQuizzes() {
  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".quiz-q");
    var total = questions.length;
    var answered = 0;
    var correctCount = 0;

    var scoreBox = document.createElement("div");
    scoreBox.className = "quiz-score";
    scoreBox.style.display = "none";
    scoreBox.setAttribute("aria-live", "polite");
    quiz.appendChild(scoreBox);

    questions.forEach(function (q) {
      var answer = parseInt(q.getAttribute("data-answer"), 10);
      var options = q.querySelectorAll(".quiz-option");
      var feedback = q.querySelector(".quiz-feedback");
      var done = false;

      options.forEach(function (opt, idx) {
        opt.addEventListener("click", function () {
          if (done) return;
          done = true;
          answered++;
          var isRight = idx === answer;
          if (isRight) {
            opt.classList.add("correct");
            correctCount++;
            if (feedback) {
              feedback.textContent = "✅ Correct! " + (q.getAttribute("data-why") || "Great thinking!");
              feedback.className = "quiz-feedback right";
            }
          } else {
            opt.classList.add("incorrect");
            options[answer].classList.add("correct");
            if (feedback) {
              feedback.textContent = "❌ Not quite. " + (q.getAttribute("data-why") || "Look at the highlighted answer.");
              feedback.className = "quiz-feedback wrong";
            }
          }
          options.forEach(function (o) { o.disabled = true; });
          if (answered === total) {
            scoreBox.style.display = "block";
            scoreBox.classList.add("pop");
            var pct = Math.round((correctCount / total) * 100);
            var emoji = pct === 100 ? "🌟" : pct >= 60 ? "👍" : "💪";
            scoreBox.textContent = emoji + " You scored " + correctCount + " / " + total + " (" + pct + "%)";
          }
        });
      });
    });
  });
}

/* =====================================================================
   2. Interactive flashcards
   Markup:
   <div class="flashcard-deck" data-flashcards>
     <div class="flashcard"><div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">word</div>
        <div class="flashcard-face flashcard-back">meaning</div>
     </div></div>  (repeat)
     <div class="flashcard-controls">...auto-built...</div>
   </div>
   ===================================================================== */
function initFlashcards() {
  document.querySelectorAll("[data-flashcards]").forEach(function (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll(".flashcard"));
    if (!cards.length) return;
    var current = 0;

    cards.forEach(function (card, i) {
      card.style.display = i === 0 ? "block" : "none";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Flashcard. Activate to flip.");
      function flip() { card.classList.toggle("flipped"); }
      card.addEventListener("click", flip);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
    });

    var controls = document.createElement("div");
    controls.className = "flashcard-controls";
    var prev = makeBtn("◀ Prev", "btn secondary small");
    var counter = document.createElement("span");
    counter.className = "flashcard-counter";
    var next = makeBtn("Next ▶", "btn small");
    controls.appendChild(prev);
    controls.appendChild(counter);
    controls.appendChild(next);
    deck.appendChild(controls);

    function show(i) {
      cards[current].style.display = "none";
      cards[current].classList.remove("flipped");
      current = (i + cards.length) % cards.length;
      cards[current].style.display = "block";
      counter.textContent = "Card " + (current + 1) + " of " + cards.length;
    }
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
    counter.textContent = "Card 1 of " + cards.length;
  });
}

/* =====================================================================
   3. Fill-in-the-blank with "Check your answer"
   Markup:
   <div class="fitb" data-fitb>
     <p>The capital letter starts a <input type="text" data-accept="sentence|sentences"></p>
     ... (more inputs)
     <button class="btn" data-check>Check your answers</button>
     <p class="fitb-feedback" aria-live="polite"></p>
   </div>
   data-accept = pipe-separated accepted answers (case-insensitive)
   ===================================================================== */
function initFillInBlank() {
  document.querySelectorAll("[data-fitb]").forEach(function (box) {
    var inputs = box.querySelectorAll("input[data-accept]");
    var check = box.querySelector("[data-check]");
    var feedback = box.querySelector(".fitb-feedback");
    if (!check) return;
    check.addEventListener("click", function () {
      var right = 0;
      inputs.forEach(function (input) {
        var accepted = input.getAttribute("data-accept").toLowerCase().split("|").map(function (s) { return s.trim(); });
        var val = input.value.trim().toLowerCase();
        input.classList.remove("correct", "incorrect");
        if (accepted.indexOf(val) !== -1 && val !== "") {
          input.classList.add("correct");
          right++;
        } else {
          input.classList.add("incorrect");
        }
      });
      if (feedback) {
        var all = right === inputs.length;
        feedback.textContent = (all ? "🌟 " : "💪 ") + "You got " + right + " of " + inputs.length + " correct" + (all ? "! Wonderful!" : ". Try the red ones again.");
        feedback.style.color = all ? "#1f6b48" : "#a83b38";
      }
    });
  });
}

/* =====================================================================
   4. Drag-and-drop vocabulary matching
   Markup:
   <div class="dnd" data-dnd>
     <div class="dnd-col"><h4>Words</h4>
        <div class="drag-item" draggable="true" data-key="noun">noun</div> ...
     </div>
     <div class="dnd-col"><h4>Meanings</h4>
        <div class="drop-zone" data-key="noun"><span class="zone-label">a person, place, or thing</span></div> ...
     </div>
   </div>
   Matching is by data-key.
   ===================================================================== */
function initDragAndDrop() {
  document.querySelectorAll("[data-dnd]").forEach(function (board) {
    var dragging = null;
    var items = board.querySelectorAll(".drag-item");
    var zones = board.querySelectorAll(".drop-zone");

    items.forEach(function (item) {
      item.addEventListener("dragstart", function () {
        dragging = item;
        item.classList.add("dragging");
      });
      item.addEventListener("dragend", function () {
        item.classList.remove("dragging");
        dragging = null;
      });
      // Touch / click fallback: tap word then tap meaning
      item.addEventListener("click", function () {
        items.forEach(function (i) { i.style.outline = ""; });
        if (dragging === item) { dragging = null; return; }
        dragging = item;
        item.style.outline = "3px solid var(--color-primary-dark)";
      });
    });

    zones.forEach(function (zone) {
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("over"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("over"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        zone.classList.remove("over");
        place(zone);
      });
      zone.addEventListener("click", function () {
        if (dragging) place(zone);
      });
    });

    function place(zone) {
      if (!dragging) return;
      if (zone.classList.contains("matched")) return;
      var match = dragging.getAttribute("data-key") === zone.getAttribute("data-key");
      if (match) {
        zone.classList.add("matched");
        zone.classList.remove("wrong");
        var tag = document.createElement("span");
        tag.textContent = " ✅ " + dragging.textContent;
        tag.style.fontWeight = "700";
        zone.appendChild(tag);
        dragging.style.display = "none";
        dragging.style.outline = "";
        dragging = null;
        checkComplete();
      } else {
        zone.classList.add("wrong");
        setTimeout(function () { zone.classList.remove("wrong"); }, 700);
        dragging.style.outline = "";
        dragging = null;
      }
    }

    function checkComplete() {
      var matched = board.querySelectorAll(".drop-zone.matched").length;
      if (matched === zones.length) {
        var msg = board.querySelector(".dnd-done");
        if (!msg) {
          msg = document.createElement("p");
          msg.className = "dnd-done quiz-score pop";
          msg.style.gridColumn = "1 / -1";
          board.appendChild(msg);
        }
        msg.textContent = "🌟 All matched! Excellent vocabulary work!";
      }
    }
  });
}

/* =====================================================================
   5. Progress tracker (saved to localStorage)
   Markup:
   <div class="progress-tracker" data-progress="module1">
     <h3>My Progress</h3>
     <div class="progress-bar"><div class="progress-fill"></div></div>
     <p class="progress-label"></p>
     <ul class="progress-checklist">
       <li><label><input type="checkbox" value="step1"> Watch the mini-lesson</label></li> ...
     </ul>
   </div>
   ===================================================================== */
function initProgressTrackers() {
  document.querySelectorAll("[data-progress]").forEach(function (tracker) {
    var key = "g3curriculum:" + tracker.getAttribute("data-progress");
    var boxes = tracker.querySelectorAll('input[type="checkbox"]');
    var fill = tracker.querySelector(".progress-fill");
    var label = tracker.querySelector(".progress-label");
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) { saved = {}; }

    function update() {
      var done = 0;
      var state = {};
      boxes.forEach(function (b) {
        state[b.value] = b.checked;
        if (b.checked) done++;
      });
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
      var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
      if (fill) fill.style.width = pct + "%";
      if (label) label.textContent = done + " of " + boxes.length + " steps complete (" + pct + "%)" + (pct === 100 ? " 🎉" : "");
    }

    boxes.forEach(function (b) {
      if (saved[b.value]) b.checked = true;
      b.addEventListener("change", update);
    });
    update();
  });
}

/* =====================================================================
   6. Reflection response box (saved to localStorage)
   Markup:
   <div class="reflection" data-reflection="module1">
     <textarea placeholder="Type your thinking here..."></textarea>
     <button class="btn small" data-save>Save my reflection</button>
     <p class="save-status" aria-live="polite"></p>
   </div>
   ===================================================================== */
function initReflections() {
  document.querySelectorAll("[data-reflection]").forEach(function (box) {
    var key = "g3reflection:" + box.getAttribute("data-reflection");
    var ta = box.querySelector("textarea");
    var save = box.querySelector("[data-save]");
    var status = box.querySelector(".save-status");
    if (!ta) return;
    try { ta.value = localStorage.getItem(key) || ""; } catch (e) {}
    if (save) {
      save.addEventListener("click", function () {
        try { localStorage.setItem(key, ta.value); } catch (e) {}
        if (status) {
          status.textContent = "✓ Saved on this device! You can come back anytime.";
          setTimeout(function () { status.textContent = ""; }, 4000);
        }
      });
    }
  });
}

/* =====================================================================
   7. Word scramble challenge game
   Markup:
   <div class="game" data-game='["because","question","creature"]'>
     <p>Unscramble the spelling word!</p>
     <p class="game-scrambled"></p>
     <input type="text" aria-label="Your answer">
     <button class="btn" data-guess>Check</button>
     <button class="btn secondary" data-skip>Skip</button>
     <p class="game-feedback" aria-live="polite"></p>
     <p>Score: <span class="game-score">0</span></p>
   </div>
   ===================================================================== */
function initWordGames() {
  document.querySelectorAll("[data-game]").forEach(function (game) {
    var words = [];
    try { words = JSON.parse(game.getAttribute("data-game")); } catch (e) { return; }
    if (!words.length) return;
    var idx = 0, score = 0;
    var scrambledEl = game.querySelector(".game-scrambled");
    var input = game.querySelector("input");
    var guess = game.querySelector("[data-guess]");
    var skip = game.querySelector("[data-skip]");
    var feedback = game.querySelector(".game-feedback");
    var scoreEl = game.querySelector(".game-score");

    function scramble(word) {
      var a = word.split("");
      // deterministic-ish shuffle that still differs from the word
      for (var tries = 0; tries < 5; tries++) {
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor((i * 7 + word.length * 3 + tries * 13) % (i + 1));
          var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        if (a.join("") !== word) break;
      }
      return a.join("");
    }

    function load() {
      if (idx >= words.length) {
        scrambledEl.textContent = "🎉";
        feedback.textContent = "You finished all the words! Final score: " + score + "/" + words.length;
        input.style.display = "none";
        guess.style.display = "none";
        skip.style.display = "none";
        return;
      }
      scrambledEl.textContent = scramble(words[idx]).toUpperCase();
      input.value = "";
      input.focus();
      feedback.textContent = "Word " + (idx + 1) + " of " + words.length;
      feedback.style.color = "";
    }

    function check() {
      if (input.value.trim().toLowerCase() === words[idx].toLowerCase()) {
        score++;
        scoreEl.textContent = score;
        feedback.textContent = "✅ Correct!";
        feedback.style.color = "#1f6b48";
        idx++;
        setTimeout(load, 800);
      } else {
        feedback.textContent = "❌ Try again! Listen to the sounds.";
        feedback.style.color = "#a83b38";
      }
    }

    if (guess) guess.addEventListener("click", check);
    if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    if (skip) skip.addEventListener("click", function () {
      feedback.textContent = "The word was: " + words[idx];
      idx++;
      setTimeout(load, 1200);
    });
    load();
  });
}

/* =====================================================================
   8. Self-contained instructional video player
   An animated slideshow with synchronized captions and optional
   browser narration (Web Speech API). No files to render or download.
   Markup:
   <div class="video-player">
     <div class="video-stage">
       <div class="video-slide" data-narration="Spoken text..." data-duration="8">
         <div class="slide-content"> ...HTML visual... </div>
       </div>
       ... more slides ...
     </div>
     <p class="video-caption" aria-live="polite"></p>
     <div class="video-controls">
       <button class="btn small" data-play>▶ Play</button>
       <button class="btn secondary small" data-prev>◀ Back</button>
       <button class="btn secondary small" data-next>Next ▶</button>
       <button class="btn secondary small" data-restart>↺ Restart</button>
       <button class="btn secondary small" data-sound>🔊 Sound on</button>
       <div class="video-progress"><div class="video-progress-fill"></div></div>
       <span class="video-counter"></span>
     </div>
   </div>
   data-duration is the fallback seconds-per-slide used when sound is off
   or speech is unavailable. With sound on, slides advance when narration ends.
   ===================================================================== */
function initVideoPlayers() {
  var roots = document.querySelectorAll(".video-player");
  if (!roots.length) return;
  var supportsTTS = "speechSynthesis" in window;
  var players = [];

  // Try to warm up the voice list (loads asynchronously in some browsers)
  if (supportsTTS) {
    try { window.speechSynthesis.getVoices(); } catch (e) {}
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", function () {
        try { window.speechSynthesis.getVoices(); } catch (e) {}
      });
    }
  }

  roots.forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".video-slide"));
    if (!slides.length) return;

    var caption = root.querySelector(".video-caption");
    var bar = root.querySelector(".video-progress-fill");
    var counter = root.querySelector(".video-counter");
    var playBtn = root.querySelector("[data-play]");
    var prevBtn = root.querySelector("[data-prev]");
    var nextBtn = root.querySelector("[data-next]");
    var restartBtn = root.querySelector("[data-restart]");
    var soundBtn = root.querySelector("[data-sound]");

    var idx = 0;
    var playing = false;
    var soundOn = supportsTTS;
    var timer = null;
    var token = 0; // invalidates stale speech/timer callbacks

    var api = { stop: function () { pause(); } };
    players.push(api);

    function durationFor(slide) {
      var d = parseFloat(slide.getAttribute("data-duration"));
      if (!isNaN(d)) return d * 1000;
      var words = (slide.getAttribute("data-narration") || "").split(/\s+/).length;
      return Math.max(3500, words * 380 + 1200);
    }

    // Choose a clear, young-sounding female English voice ("friendly teacher").
    // The Web Speech API has no gender field, so we match known female voice names
    // across Windows / macOS / iOS / Android / Chrome, then fall back gracefully.
    function pickVoice(u) {
      try {
        var voices = window.speechSynthesis.getVoices();
        if (!voices || !voices.length) return;
        var preferred = [
          "samantha", "aria", "jenny", "zira", "michelle", "ava", "allison",
          "susan", "karen", "catherine", "fiona", "tessa", "serena", "moira",
          "hazel", "heera", "google us english", "google uk english female", "female"
        ];
        var en = voices.filter(function (v) { return /^en[-_]/i.test(v.lang); });
        var pool = en.length ? en : voices;
        // 1) a known female voice by name
        for (var p = 0; p < preferred.length; p++) {
          for (var i = 0; i < pool.length; i++) {
            if (pool[i].name.toLowerCase().indexOf(preferred[p]) !== -1) { u.voice = pool[i]; return; }
          }
        }
        // 2) any voice explicitly flagged "female"
        for (var j = 0; j < pool.length; j++) {
          if (/female/i.test(pool[j].name)) { u.voice = pool[j]; return; }
        }
        // 3) fallback: first English voice available
        if (en.length) u.voice = en[0];
      } catch (e) {}
    }

    function show(i) {
      idx = i;
      slides.forEach(function (s, n) { s.classList.toggle("active", n === i); });
      var slide = slides[i];
      if (caption) caption.textContent = slide.getAttribute("data-narration") || "";
      if (counter) counter.textContent = (i + 1) + " / " + slides.length;
      if (bar) bar.style.width = Math.round(((i + 1) / slides.length) * 100) + "%";
    }

    function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }

    function run() {
      clearTimer();
      var myToken = ++token;
      var slide = slides[idx];
      var text = slide.getAttribute("data-narration") || "";
      if (soundOn && supportsTTS && text) {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.rate = 0.98; u.pitch = 1.18; // clear, warm, young-teacher tone
        pickVoice(u);
        u.onend = function () { if (playing && myToken === token) advance(); };
        window.speechSynthesis.speak(u);
        // safety net in case onend never fires (a known browser quirk)
        timer = setTimeout(function () { if (playing && myToken === token) advance(); }, durationFor(slide) + 4000);
      } else {
        timer = setTimeout(function () { if (playing && myToken === token) advance(); }, durationFor(slide));
      }
    }

    function advance() {
      if (idx < slides.length - 1) { show(idx + 1); run(); }
      else { pause(); }
    }

    function play() {
      players.forEach(function (p) { if (p !== api) p.stop(); });
      if (idx >= slides.length - 1) show(0); // replay from start when finished
      playing = true;
      setLabel();
      run();
    }

    function pause() {
      playing = false;
      token++;
      clearTimer();
      if (supportsTTS) { try { window.speechSynthesis.cancel(); } catch (e) {} }
      setLabel();
    }

    function setLabel() { if (playBtn) playBtn.innerHTML = playing ? "⏸ Pause" : "▶ Play"; }

    if (playBtn) playBtn.addEventListener("click", function () { playing ? pause() : play(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { pause(); show(Math.max(0, idx - 1)); });
    if (nextBtn) nextBtn.addEventListener("click", function () { pause(); show(Math.min(slides.length - 1, idx + 1)); });
    if (restartBtn) restartBtn.addEventListener("click", function () { pause(); show(0); });

    if (soundBtn) {
      if (!supportsTTS) {
        soundBtn.style.display = "none";
      } else {
        soundBtn.innerHTML = "🔊 Sound on";
        soundBtn.addEventListener("click", function () {
          soundOn = !soundOn;
          soundBtn.innerHTML = soundOn ? "🔊 Sound on" : "🔇 Captions only";
          soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
          if (playing) run(); // restart current slide with the new setting
        });
      }
    }

    show(0);
  });

  // Stop any narration when the page is hidden or unloaded
  window.addEventListener("beforeunload", function () {
    if (supportsTTS) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      players.forEach(function (p) { p.stop(); });
    }
  });
}

/* ---------- Subtle fade-in on scroll ---------- */
function initFadeIn() {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-up");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll("[data-fade]").forEach(function (el) { obs.observe(el); });
}

/* ---------- helper ---------- */
function makeBtn(text, cls) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = cls;
  b.textContent = text;
  return b;
}
