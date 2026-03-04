/* ============================================
   原価計算アカデミー - フェーズ別コスト JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initStepBar();
  initPhaseCompareTable();
  initPhaseDetails();
  initFadeInAnimation();
});

/* --- 治験の流れ ステップバー --- */
function initStepBar() {
  var container = document.getElementById("step-bar");
  if (!container || typeof PHASE_DATA === "undefined") return;

  var steps = [
    { label: "前臨床", id: null },
    { label: "Phase I", id: "phase1" },
    { label: "Phase II", id: "phase2" },
    { label: "Phase III", id: "phase3" },
    { label: "承認申請", id: null },
    { label: "PMS", id: "pms" }
  ];

  var html = "";
  steps.forEach(function (step, i) {
    var isClickable = step.id !== null;
    var activeClass = isClickable ? " step-clickable" : "";
    html +=
      '<div class="step-item' + activeClass + '" data-phase="' + (step.id || "") + '">' +
        '<div class="step-number">' + (i + 1) + '</div>' +
        '<div class="step-label">' + step.label + '</div>' +
        (i < steps.length - 1 ? '<div class="step-connector"></div>' : '') +
      '</div>';
  });

  container.innerHTML = html;

  // クリックイベント
  var clickableSteps = container.querySelectorAll(".step-clickable");
  clickableSteps.forEach(function (el) {
    el.addEventListener("click", function () {
      var phaseId = this.getAttribute("data-phase");
      if (!phaseId) return;

      // アクティブ状態の管理
      var allSteps = container.querySelectorAll(".step-item");
      allSteps.forEach(function (s) { s.classList.remove("step-active"); });
      this.classList.add("step-active");

      // 対応セクションにスクロール
      var target = document.getElementById("detail-" + phaseId);
      if (target) {
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
}

/* --- フェーズ別コスト比較テーブル --- */
function initPhaseCompareTable() {
  var tableBody = document.getElementById("phase-compare-body");
  if (!tableBody || typeof PHASE_DATA === "undefined") return;

  var html = "";
  PHASE_DATA.forEach(function (phase) {
    html +=
      '<tr>' +
        '<td data-label="フェーズ"><strong>' + escapeHtml(phase.name) + '</strong></td>' +
        '<td data-label="症例数">' + escapeHtml(phase.subjects) + '</td>' +
        '<td data-label="施設数">' + escapeHtml(phase.sites) + '</td>' +
        '<td data-label="期間">' + escapeHtml(phase.duration) + '</td>' +
        '<td class="amount" data-label="総費用">' + escapeHtml(phase.totalCostBillion) + '</td>' +
        '<td data-label="成功率">' + escapeHtml(phase.successRate) + '</td>' +
      '</tr>';
  });

  tableBody.innerHTML = html;
}

/* --- 各フェーズの詳細セクション --- */
function initPhaseDetails() {
  var container = document.getElementById("phase-details");
  if (!container || typeof PHASE_DATA === "undefined" || typeof ROLE_DATA === "undefined") return;

  // 職種カラーマップ
  var roleColors = {
    cra: "#e53e3e",
    dm: "#3182ce",
    stat: "#805ad5",
    mw: "#38a169",
    pv: "#e67e22",
    qa: "#718096",
    pm: "#d35400",
    reg: "#2b6cb0"
  };

  var html = "";
  PHASE_DATA.forEach(function (phase, idx) {
    var bgStyle = idx % 2 === 0 ? ' style="background-color: var(--color-white);"' : '';

    html += '<section class="section fade-in" id="detail-' + phase.id + '"' + bgStyle + '>';
    html += '<div class="container">';

    // フェーズ名と説明
    html += '<div class="phase-detail-header">';
    html += '<h2 class="section-title">' + escapeHtml(phase.name) + '</h2>';
    html += '<p class="text-center text-light mb-4">' + escapeHtml(phase.subtitle) + '</p>';
    html += '</div>';

    html += '<div class="phase-detail-content">';

    // 説明
    html += '<div class="card mb-4">';
    html += '<p>' + escapeHtml(phase.description) + '</p>';

    // 重要な活動リスト
    html += '<h4>重要な活動</h4>';
    html += '<ul class="activity-list">';
    phase.keyActivities.forEach(function (activity) {
      html += '<li class="activity-item">' + escapeHtml(activity) + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // 主要数値カード
    html += '<div class="grid grid-4 mb-4">';

    html += '<div class="card text-center phase-stat-card">';
    html += '<div class="phase-stat-value">' + escapeHtml(phase.subjects) + '</div>';
    html += '<div class="phase-stat-label">症例数</div>';
    html += '</div>';

    html += '<div class="card text-center phase-stat-card">';
    html += '<div class="phase-stat-value">' + escapeHtml(phase.sites) + '</div>';
    html += '<div class="phase-stat-label">施設数</div>';
    html += '</div>';

    html += '<div class="card text-center phase-stat-card">';
    html += '<div class="phase-stat-value">' + escapeHtml(phase.duration) + '</div>';
    html += '<div class="phase-stat-label">期間</div>';
    html += '</div>';

    html += '<div class="card text-center phase-stat-card">';
    html += '<div class="phase-stat-value">' + formatNumber(phase.costPerSubject) + '<span class="phase-stat-unit">万円</span></div>';
    html += '<div class="phase-stat-label">1症例あたりコスト</div>';
    html += '</div>';

    html += '</div>'; // .grid

    // 工数配分グラフ
    html += '<div class="card">';
    html += '<h3>工数配分（FTE Allocation）</h3>';
    html += '<div class="bar-chart" id="fte-chart-' + phase.id + '">';

    // 各職種の%を横棒で表示
    var allocationKeys = Object.keys(phase.fteAllocation);
    allocationKeys.forEach(function (roleId) {
      var pct = phase.fteAllocation[roleId];
      var roleName = getRoleName(roleId);
      var color = roleColors[roleId] || "var(--color-primary)";

      html +=
        '<div class="bar-chart-item">' +
          '<span class="bar-chart-label">' + escapeHtml(roleName) + '</span>' +
          '<div class="bar-chart-track">' +
            '<div class="bar-chart-fill" style="width:' + pct + '%; background: linear-gradient(90deg, ' + color + ' 0%, ' + color + 'cc 100%);" data-width="' + pct + '">' +
              '<span class="bar-chart-value">' + pct + '%</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html += '</div>'; // .bar-chart
    html += '</div>'; // .card

    html += '</div>'; // .phase-detail-content
    html += '</div>'; // .container
    html += '</section>';
  });

  container.innerHTML = html;
}

/* --- ROLE_DATAから職種名を取得 --- */
function getRoleName(roleId) {
  if (typeof ROLE_DATA === "undefined") return roleId;
  var role = ROLE_DATA.find(function (r) { return r.id === roleId; });
  return role ? role.name : roleId;
}

/* --- フェードインアニメーション（再初期化対応） --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}
