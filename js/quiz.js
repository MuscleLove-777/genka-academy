/* ============================================
   原価計算アカデミー - クイズ JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initQuiz();
});

/* --- クイズの状態管理 --- */
var quizState = {
  currentIndex: 0,
  score: 0,
  answers: [], // { questionId, selectedIndex, correct }
  answered: false
};

/* --- クイズ初期化 --- */
function initQuiz() {
  if (typeof QUIZ_DATA === "undefined" || typeof QUIZ_RESULTS === "undefined") return;

  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answers = [];
  quizState.answered = false;

  showQuestion(0);
  initQuizEvents();
}

/* --- イベントリスナー --- */
function initQuizEvents() {
  var nextBtn = document.getElementById("quiz-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextQuestion();
    });
  }

  var retryBtn = document.getElementById("quiz-retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", function () {
      retryQuiz();
    });
  }
}

/* --- 問題を表示 --- */
function showQuestion(index) {
  if (typeof QUIZ_DATA === "undefined") return;
  if (index >= QUIZ_DATA.length) {
    showResult();
    return;
  }

  var q = QUIZ_DATA[index];
  quizState.currentIndex = index;
  quizState.answered = false;

  // 進捗バー更新
  var total = QUIZ_DATA.length;
  var progressPct = ((index) / total) * 100;
  var progressFill = document.getElementById("quiz-progress-fill");
  var progressText = document.getElementById("quiz-progress-text");
  if (progressFill) progressFill.style.width = progressPct + "%";
  if (progressText) progressText.textContent = "問題 " + (index + 1) + " / " + total;

  // 問題番号
  var qNum = document.getElementById("quiz-question-number");
  if (qNum) qNum.textContent = "Q" + (index + 1);

  // 問題文
  var qText = document.getElementById("quiz-question");
  if (qText) qText.textContent = q.question;

  // 選択肢生成
  var choicesContainer = document.getElementById("quiz-choices");
  if (choicesContainer) {
    var html = "";
    q.choices.forEach(function (choice, i) {
      html +=
        '<button class="quiz-choice-btn" data-index="' + i + '">' +
          '<span class="quiz-choice-label">' + getChoiceLetter(i) + '</span>' +
          '<span class="quiz-choice-text">' + escapeHtml(choice) + '</span>' +
        '</button>';
    });
    choicesContainer.innerHTML = html;

    // 選択肢クリックイベント
    var btns = choicesContainer.querySelectorAll(".quiz-choice-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (quizState.answered) return;
        var selectedIndex = parseInt(this.getAttribute("data-index"), 10);
        handleAnswer(selectedIndex);
      });
    });
  }

  // フィードバック非表示
  var feedback = document.getElementById("quiz-feedback");
  var actions = document.getElementById("quiz-actions");
  if (feedback) feedback.classList.add("hidden");
  if (actions) actions.classList.add("hidden");
}

/* --- 選択肢のラベル (A, B, C, D) --- */
function getChoiceLetter(index) {
  return ["A", "B", "C", "D"][index] || "";
}

/* --- 回答処理 --- */
function handleAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;

  var q = QUIZ_DATA[quizState.currentIndex];
  var correctIndex = q.answer; // answer は 0-based index
  var isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
    quizState.score++;
  }

  // 回答を記録
  quizState.answers.push({
    questionId: q.id,
    selectedIndex: selectedIndex,
    correct: isCorrect
  });

  // 選択肢の色分け
  var btns = document.querySelectorAll(".quiz-choice-btn");
  btns.forEach(function (btn, i) {
    btn.classList.add("quiz-choice-disabled");
    if (i === correctIndex) {
      btn.classList.add("quiz-choice-correct");
    }
    if (i === selectedIndex && !isCorrect) {
      btn.classList.add("quiz-choice-wrong");
    }
  });

  // フィードバック表示
  var feedback = document.getElementById("quiz-feedback");
  var feedbackIcon = document.getElementById("quiz-feedback-icon");
  var feedbackText = document.getElementById("quiz-feedback-text");
  var explanation = document.getElementById("quiz-explanation");

  if (feedback) feedback.classList.remove("hidden");
  if (feedbackIcon) feedbackIcon.textContent = isCorrect ? "&#x2705;" : "&#x274C;";
  if (feedbackIcon) feedbackIcon.innerHTML = isCorrect ? "&#x2705;" : "&#x274C;";
  if (feedbackText) feedbackText.textContent = isCorrect ? "正解！" : "不正解";
  if (feedbackText) feedbackText.className = "quiz-feedback-text " + (isCorrect ? "quiz-correct" : "quiz-wrong");
  if (explanation) explanation.textContent = q.explanation;

  // ボタン表示
  var actions = document.getElementById("quiz-actions");
  var nextBtn = document.getElementById("quiz-next-btn");
  if (actions) actions.classList.remove("hidden");

  var isLast = quizState.currentIndex >= QUIZ_DATA.length - 1;
  if (nextBtn) nextBtn.textContent = isLast ? "結果を見る" : "次の問題へ";
}

/* --- 次の問題 --- */
function nextQuestion() {
  var nextIndex = quizState.currentIndex + 1;
  if (nextIndex >= QUIZ_DATA.length) {
    showResult();
  } else {
    showQuestion(nextIndex);
  }
}

/* --- 結果画面表示 --- */
function showResult() {
  var quizMain = document.getElementById("quiz-main");
  var quizResult = document.getElementById("quiz-result");
  if (quizMain) quizMain.classList.add("hidden");
  if (quizResult) quizResult.classList.remove("hidden");

  var total = QUIZ_DATA.length;
  var score = quizState.score;

  // スコア表示
  var scoreEl = document.getElementById("quiz-result-score");
  if (scoreEl) scoreEl.textContent = score + " / " + total;

  // 診断結果の判定
  var result = getQuizResult(score);
  var titleEl = document.getElementById("quiz-result-title");
  var descEl = document.getElementById("quiz-result-desc");
  var adviceEl = document.getElementById("quiz-result-advice");

  if (titleEl) titleEl.textContent = result.title;
  if (descEl) descEl.textContent = result.description;
  if (adviceEl) adviceEl.textContent = result.advice;

  // 正誤一覧
  var listContainer = document.getElementById("quiz-result-list");
  if (listContainer) {
    var html = '<h3 class="mb-3">問題別結果</h3>';
    html += '<div class="quiz-result-items">';

    quizState.answers.forEach(function (ans, i) {
      var q = QUIZ_DATA[i];
      var icon = ans.correct ? "&#x2705;" : "&#x274C;";
      var statusClass = ans.correct ? "quiz-result-correct" : "quiz-result-wrong";

      html +=
        '<div class="quiz-result-item ' + statusClass + '">' +
          '<span class="quiz-result-item-icon">' + icon + '</span>' +
          '<span class="quiz-result-item-num">Q' + (i + 1) + '</span>' +
          '<span class="quiz-result-item-text">' + escapeHtml(q.question.substring(0, 50)) + (q.question.length > 50 ? '...' : '') + '</span>' +
        '</div>';
    });

    html += '</div>';
    listContainer.innerHTML = html;
  }

  // 進捗バーを100%に
  var progressFill = document.getElementById("quiz-progress-fill");
  if (progressFill) progressFill.style.width = "100%";
}

/* --- QUIZ_RESULTSからスコアに応じた診断結果を判定 --- */
function getQuizResult(score) {
  if (typeof QUIZ_RESULTS === "undefined") {
    return { title: "", description: "", advice: "" };
  }

  // min が大きい順にチェック
  var levels = [
    { key: "master", data: QUIZ_RESULTS.master },
    { key: "advanced", data: QUIZ_RESULTS.advanced },
    { key: "intermediate", data: QUIZ_RESULTS.intermediate },
    { key: "beginner", data: QUIZ_RESULTS.beginner },
    { key: "novice", data: QUIZ_RESULTS.novice }
  ];

  for (var i = 0; i < levels.length; i++) {
    if (score >= levels[i].data.min) {
      return levels[i].data;
    }
  }

  return QUIZ_RESULTS.novice;
}

/* --- リトライ --- */
function retryQuiz() {
  var quizMain = document.getElementById("quiz-main");
  var quizResult = document.getElementById("quiz-result");
  if (quizMain) quizMain.classList.remove("hidden");
  if (quizResult) quizResult.classList.add("hidden");

  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answers = [];
  quizState.answered = false;

  showQuestion(0);
}
