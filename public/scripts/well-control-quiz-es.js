function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const mainBox = document.getElementById("quiz-interactive-main");
let queue = [];
let index = 0;
let correctCount = 0;
let currentTopicName = "";
let attempts = [];
function renderQuestion() {
  if (!mainBox) return;
  const q = queue[index];
  const entries = Object.entries(q.choices).filter(([, text]) => text);
  mainBox.innerHTML = `
      <div class="qi-topic-label">${currentTopicName}</div>
      <div class="qi-progress">Pregunta ${index + 1} de ${queue.length}</div>
      <div class="qi-text"></div>
      <div class="qi-choices"></div>
    `;
  mainBox.querySelector(".qi-text").textContent = q.question;
  const choicesEl = mainBox.querySelector(".qi-choices");
  entries.forEach(([letter, text]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "qi-choice";
    btn.textContent = `${letter}. ${text}`;
    btn.addEventListener("click", () => selectChoice(letter, q));
    choicesEl.appendChild(btn);
  });
}
function selectChoice(letter, q) {
  if (!mainBox) return;
  const buttons = Array.from(mainBox.querySelectorAll(".qi-choice"));
  buttons.forEach((b) => b.disabled = true);
  const isRight = letter === q.correctAnswer;
  if (isRight) correctCount++;
  attempts.push({ question: q, chosen: letter });
  buttons.forEach((b) => {
    const l = b.textContent?.trim().charAt(0);
    if (l === q.correctAnswer) b.classList.add("right");
    else if (l === letter) b.classList.add("wrong");
  });
  const explainDiv = document.createElement("div");
  explainDiv.className = "qi-explain";
  explainDiv.innerHTML = `<strong>${isRight ? "Correcto." : "No exactamente."}</strong> ${q.explanation}`;
  mainBox.appendChild(explainDiv);
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "btn btn-primary";
  nextBtn.textContent = index + 1 < queue.length ? "Siguiente Pregunta \u2192" : "Ver Puntaje \u2192";
  nextBtn.addEventListener("click", () => {
    index++;
    if (index < queue.length) renderQuestion();
    else showResults();
  });
  mainBox.appendChild(nextBtn);
}
function showResults() {
  if (!mainBox) return;
  const pct = Math.round(correctCount / queue.length * 100);
  mainBox.innerHTML = `
      <div class="qi-topic-label">${currentTopicName}</div>
      <div class="qi-score-big">${correctCount} / ${queue.length}</div>
      <div class="qi-score-sub">${pct}% correcto \u2014 ${queue.length - correctCount} incorrectas</div>
    `;
  const review = document.createElement("div");
  review.className = "qi-review";
  review.innerHTML = '<div class="qi-review-title">Revisi\xF3n \u2014 cada pregunta, respuesta correcta y por qu\xE9</div>';
  attempts.forEach((a, i) => {
    const isRight = a.chosen === a.question.correctAnswer;
    const item = document.createElement("div");
    item.className = "qi-review-item" + (isRight ? "" : " wrong");
    const chosenText = a.question.choices[a.chosen] ?? a.chosen;
    const correctText = a.question.choices[a.question.correctAnswer];
    item.innerHTML = `
        <div class="qi-review-q">${i + 1}. ${a.question.question}</div>
        <div class="qi-review-your ${isRight ? "right" : "wrong"}">Tu respuesta: ${a.chosen}. ${chosenText}${isRight ? " \u2713" : ""}</div>
        ${isRight ? "" : `<div class="qi-review-correct">Respuesta correcta: ${a.question.correctAnswer}. ${correctText}</div>`}
        <div class="qi-review-explain"><strong>Por qu\xE9:</strong> ${a.question.explanation}</div>
      `;
    review.appendChild(item);
  });
  mainBox.appendChild(review);
  const retryBtn = document.createElement("button");
  retryBtn.type = "button";
  retryBtn.className = "btn btn-primary";
  retryBtn.style.display = "block";
  retryBtn.style.margin = "0 auto 10px";
  retryBtn.textContent = "Repetir Este Tema";
  retryBtn.addEventListener("click", () => startQuiz(currentTopicName, queue));
  mainBox.appendChild(retryBtn);
  const pickerBtn = document.createElement("button");
  pickerBtn.type = "button";
  pickerBtn.className = "btn btn-outline";
  pickerBtn.style.display = "block";
  pickerBtn.style.margin = "0 auto";
  pickerBtn.textContent = "Probar Otro Tema";
  pickerBtn.addEventListener("click", () => {
    mainBox.classList.add("hidden");
    mainBox.classList.remove("active");
    document.getElementById("quiz-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  mainBox.appendChild(pickerBtn);
}
function startQuiz(topicName, allQuestions) {
  if (!mainBox) return;
  currentTopicName = topicName;
  queue = shuffle(allQuestions);
  index = 0;
  correctCount = 0;
  attempts = [];
  mainBox.classList.remove("hidden");
  mainBox.classList.add("active");
  renderQuestion();
  mainBox.scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelectorAll(".quiz-pick-btn").forEach((btn) => {
  const slug = btn.dataset.topicSlug;
  const dataScript = document.querySelector(`script.quiz-data[data-topic-slug="${slug}"]`);
  const topicName = btn.querySelector("h3")?.textContent ?? "";
  if (!dataScript) return;
  const allQuestions = JSON.parse(dataScript.textContent || "[]");
  const start = () => startQuiz(topicName, allQuestions);
  btn.addEventListener("click", start);
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      start();
    }
  });
});
