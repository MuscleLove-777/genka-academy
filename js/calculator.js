/* ============================================
   原価計算アカデミー - シミュレーター JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initPhaseSelect();
  initFteInputs();
  initSliderSync();
  initCalculation();
  calculate(); // 初期計算
});

/* --- 職種カラーマップ --- */
var ROLE_COLORS = {
  cra: "#e53e3e",
  dm: "#3182ce",
  stat: "#805ad5",
  mw: "#38a169",
  pv: "#e67e22",
  qa: "#718096",
  pm: "#d35400",
  reg: "#2b6cb0"
};

/* --- フェーズ選択プルダウン生成 --- */
function initPhaseSelect() {
  var select = document.getElementById("calc-phase");
  if (!select || typeof PHASE_DATA === "undefined") return;

  PHASE_DATA.forEach(function (phase) {
    var opt = document.createElement("option");
    opt.value = phase.id;
    opt.textContent = phase.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", function () {
    applyPhasePreset(this.value);
    calculate();
  });
}

/* --- フェーズ選択でデフォルト値プリセット --- */
function applyPhasePreset(phaseId) {
  if (!phaseId) return;
  var phase = PHASE_DATA.find(function (p) { return p.id === phaseId; });
  if (!phase) return;

  // プリセット値マッピング
  var presets = {
    phase1: { duration: 9, subjects: 50, sites: 3, ftes: { cra: 1.0, dm: 0.5, stat: 0.5, mw: 0.5, pv: 1.0, qa: 0.5, pm: 1.0, reg: 0.5 } },
    phase2: { duration: 18, subjects: 200, sites: 20, ftes: { cra: 2.0, dm: 1.0, stat: 1.0, mw: 0.5, pv: 1.0, qa: 0.5, pm: 1.0, reg: 0.5 } },
    phase3: { duration: 36, subjects: 300, sites: 50, ftes: { cra: 3.0, dm: 1.5, stat: 1.0, mw: 1.0, pv: 1.0, qa: 0.5, pm: 1.0, reg: 0.5 } },
    pms: { duration: 60, subjects: 3000, sites: 100, ftes: { cra: 1.5, dm: 1.5, stat: 0.5, mw: 0.5, pv: 2.0, qa: 0.5, pm: 1.0, reg: 0.5 } }
  };

  var preset = presets[phaseId];
  if (!preset) return;

  setSliderValue("calc-duration", preset.duration);
  setSliderValue("calc-subjects", preset.subjects);
  setSliderValue("calc-sites", preset.sites);

  // FTE値の設定
  Object.keys(preset.ftes).forEach(function (roleId) {
    var rangeEl = document.getElementById("calc-fte-" + roleId + "-range");
    var numEl = document.getElementById("calc-fte-" + roleId + "-num");
    if (rangeEl && numEl) {
      rangeEl.value = preset.ftes[roleId];
      numEl.value = preset.ftes[roleId];
    }
  });
}

/* --- スライダー値の一括設定 --- */
function setSliderValue(prefix, value) {
  var range = document.getElementById(prefix + "-range");
  var num = document.getElementById(prefix + "-num");
  if (range) range.value = value;
  if (num) num.value = value;
}

/* --- 職種別FTE入力欄の生成 --- */
function initFteInputs() {
  var container = document.getElementById("calc-fte-inputs");
  if (!container || typeof ROLE_DATA === "undefined") return;

  var html = "";
  ROLE_DATA.forEach(function (role) {
    html +=
      '<div class="calc-fte-row">' +
        '<div class="calc-fte-info">' +
          '<span class="calc-fte-name">' + escapeHtml(role.name) + '</span>' +
        '</div>' +
        '<div class="calc-fte-controls">' +
          '<div class="slider-sync slider-sync-compact">' +
            '<input type="range" class="form-range" id="calc-fte-' + role.id + '-range" min="0" max="5" step="0.5" value="0" data-role="' + role.id + '">' +
            '<input type="number" class="form-input slider-number" id="calc-fte-' + role.id + '-num" min="0" max="5" step="0.5" value="0" data-role="' + role.id + '">' +
            '<span class="slider-unit">FTE</span>' +
          '</div>' +
          '<select class="form-select calc-exp-select" id="calc-exp-' + role.id + '" data-role="' + role.id + '">' +
            '<option value="0">1-3年</option>' +
            '<option value="1" selected>4-6年</option>' +
            '<option value="2">7-10年</option>' +
            '<option value="3">10年以上</option>' +
          '</select>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- スライダーと数値入力の同期 --- */
function initSliderSync() {
  var syncPairs = [
    ["calc-duration-range", "calc-duration-num"],
    ["calc-subjects-range", "calc-subjects-num"],
    ["calc-sites-range", "calc-sites-num"],
    ["calc-overhead-range", "calc-overhead-num"],
    ["calc-profit-range", "calc-profit-num"]
  ];

  // FTEペアも追加
  if (typeof ROLE_DATA !== "undefined") {
    ROLE_DATA.forEach(function (role) {
      syncPairs.push(["calc-fte-" + role.id + "-range", "calc-fte-" + role.id + "-num"]);
    });
  }

  syncPairs.forEach(function (pair) {
    var rangeEl = document.getElementById(pair[0]);
    var numEl = document.getElementById(pair[1]);
    if (!rangeEl || !numEl) return;

    rangeEl.addEventListener("input", function () {
      numEl.value = this.value;
      calculate();
    });

    numEl.addEventListener("input", function () {
      var val = parseFloat(this.value);
      var min = parseFloat(this.min);
      var max = parseFloat(this.max);
      if (!isNaN(val)) {
        if (val < min) val = min;
        if (val > max) val = max;
        rangeEl.value = val;
      }
      calculate();
    });
  });
}

/* --- 全入力にリスナー追加 --- */
function initCalculation() {
  // 直接経費入力
  var travelEl = document.getElementById("calc-travel");
  var otherEl = document.getElementById("calc-other-direct");
  if (travelEl) travelEl.addEventListener("input", calculate);
  if (otherEl) otherEl.addEventListener("input", calculate);

  // 経験年数セレクト
  var expSelects = document.querySelectorAll(".calc-exp-select");
  expSelects.forEach(function (sel) {
    sel.addEventListener("change", calculate);
  });
}

/* --- メイン計算ロジック --- */
function calculate() {
  if (typeof ROLE_DATA === "undefined") return;

  var duration = getNumVal("calc-duration-num", 12);
  var subjects = getNumVal("calc-subjects-num", 100);
  var overheadRate = getNumVal("calc-overhead-num", 25) / 100;
  var profitRate = getNumVal("calc-profit-num", 15) / 100;
  var travelCost = getNumVal("calc-travel", 0);
  var otherDirect = getNumVal("calc-other-direct", 0);

  // 各職種の人件費計算
  var totalLaborCost = 0;
  var roleCosts = [];

  ROLE_DATA.forEach(function (role) {
    var fte = getNumVal("calc-fte-" + role.id + "-num", 0);
    var expIndex = getSelectVal("calc-exp-" + role.id, 1);
    var expLevel = role.experienceLevels[expIndex];
    var monthlyRate = expLevel ? expLevel.monthlyRate : 0;

    var cost = monthlyRate * fte * duration;
    totalLaborCost += cost;

    roleCosts.push({
      id: role.id,
      name: role.name,
      fte: fte,
      cost: cost,
      color: ROLE_COLORS[role.id] || "#718096"
    });
  });

  // 計算
  var directExpense = travelCost + otherDirect;
  var directTotal = totalLaborCost + directExpense;
  var indirect = directTotal * overheadRate;
  var totalCost = directTotal + indirect;
  var estimate = profitRate < 1 ? totalCost / (1 - profitRate) : totalCost;
  var grossProfit = estimate - totalCost;
  var costRatio = estimate > 0 ? (totalCost / estimate * 100) : 0;
  var perSubject = subjects > 0 ? estimate / subjects : 0;

  // 出力更新
  setText("calc-estimate", formatNumber(Math.round(estimate)));
  setText("calc-labor-cost", formatNumber(Math.round(totalLaborCost)) + "万円");
  setText("calc-direct-expense", formatNumber(Math.round(directExpense)) + "万円");
  setText("calc-direct-total", formatNumber(Math.round(directTotal)) + "万円");
  setText("calc-indirect", formatNumber(Math.round(indirect)) + "万円");
  setText("calc-total-cost", formatNumber(Math.round(totalCost)) + "万円");
  setText("calc-gross-profit", formatNumber(Math.round(grossProfit)) + "万円");
  setText("calc-cost-ratio", costRatio.toFixed(1) + "%");
  setText("calc-per-subject", formatNumber(Math.round(perSubject)) + "万円");

  // グラフ描画
  drawRoleChart(roleCosts);
  drawCompositionChart(totalLaborCost, directExpense, indirect, grossProfit);
}

/* --- 職種別コスト横棒グラフ --- */
function drawRoleChart(roleCosts) {
  var container = document.getElementById("calc-role-chart");
  if (!container) return;

  var maxCost = 0;
  roleCosts.forEach(function (r) { if (r.cost > maxCost) maxCost = r.cost; });

  var html = "";
  roleCosts.forEach(function (r) {
    if (r.fte <= 0) return; // FTE 0の職種はスキップ
    var pct = maxCost > 0 ? (r.cost / maxCost * 100) : 0;
    html +=
      '<div class="bar-chart-item">' +
        '<span class="bar-chart-label">' + escapeHtml(r.name.split("（")[0]) + '</span>' +
        '<div class="bar-chart-track">' +
          '<div class="bar-chart-fill" style="width:' + pct + '%; background:' + r.color + ';">' +
            '<span class="bar-chart-value">' + formatNumber(Math.round(r.cost)) + '万</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  if (!html) {
    html = '<p class="text-light text-sm">FTEを入力すると職種別コストが表示されます</p>';
  }

  container.innerHTML = html;
}

/* --- 費用構成 積み上げバーグラフ --- */
function drawCompositionChart(labor, directExp, indirect, profit) {
  var chartContainer = document.getElementById("calc-composition-chart");
  var legendContainer = document.getElementById("calc-composition-legend");
  if (!chartContainer || !legendContainer) return;

  var total = labor + directExp + indirect + profit;
  if (total <= 0) {
    chartContainer.innerHTML = '<div class="calc-stacked-bar"><div class="calc-stacked-segment" style="width:100%; background:#e2e8f0;"></div></div>';
    legendContainer.innerHTML = '';
    return;
  }

  var segments = [
    { label: "直接人件費", value: labor, color: "var(--color-primary)" },
    { label: "直接経費", value: directExp, color: "var(--color-accent)" },
    { label: "間接費", value: indirect, color: "#805ad5" },
    { label: "利益", value: profit, color: "var(--color-success)" }
  ];

  var barHtml = '<div class="calc-stacked-bar">';
  segments.forEach(function (seg) {
    var pct = (seg.value / total * 100);
    if (pct > 0) {
      barHtml += '<div class="calc-stacked-segment" style="width:' + pct.toFixed(1) + '%; background:' + seg.color + ';" title="' + seg.label + ': ' + pct.toFixed(1) + '%"></div>';
    }
  });
  barHtml += '</div>';

  var legendHtml = '';
  segments.forEach(function (seg) {
    var pct = (seg.value / total * 100);
    legendHtml +=
      '<div class="calc-legend-item">' +
        '<span class="calc-legend-color" style="background:' + seg.color + ';"></span>' +
        '<span class="calc-legend-label">' + seg.label + '</span>' +
        '<span class="calc-legend-value">' + pct.toFixed(1) + '%</span>' +
      '</div>';
  });

  chartContainer.innerHTML = barHtml;
  legendContainer.innerHTML = legendHtml;
}

/* --- ユーティリティ --- */
function getNumVal(id, defaultVal) {
  var el = document.getElementById(id);
  if (!el) return defaultVal;
  var v = parseFloat(el.value);
  return isNaN(v) ? defaultVal : v;
}

function getSelectVal(id, defaultVal) {
  var el = document.getElementById(id);
  if (!el) return defaultVal;
  var v = parseInt(el.value, 10);
  return isNaN(v) ? defaultVal : v;
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
