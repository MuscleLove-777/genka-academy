/* ============================================
   原価計算アカデミー - 単価ランキング JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  if (typeof ROLE_DATA === "undefined" || typeof CATEGORIES === "undefined") return;

  var rankingState = {
    data: [],           // フラット化されたデータ
    filtered: [],       // フィルター後のデータ
    sortKey: "monthlyRate",
    sortDir: "desc",    // "asc" | "desc"
    categoryFilter: "all",
    experienceFilter: "all",
    searchQuery: ""
  };

  // --- 初期化 ---
  initRankingData();
  bindFilterEvents();
  bindSortEvents();
  applyFiltersAndRender();

  /**
   * ROLE_DATA を展開して全経験年数レベルのフラットなリストを生成
   */
  function initRankingData() {
    var flat = [];
    ROLE_DATA.forEach(function (role) {
      role.experienceLevels.forEach(function (level) {
        flat.push({
          id: role.id,
          name: role.name,
          nameEn: role.nameEn,
          category: role.category,
          categoryName: CATEGORIES[role.category] ? CATEGORIES[role.category].name : "",
          years: level.years,
          monthlyCost: level.monthlyCost,
          monthlyRate: level.monthlyRate,
          annualSalary: level.annualSalary,
          demandScore: role.demandScore
        });
      });
    });
    rankingState.data = flat;
  }

  /**
   * フィルターイベントのバインド
   */
  function bindFilterEvents() {
    // カテゴリタブ
    var tabs = document.querySelectorAll("#category-tabs .filter-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        rankingState.categoryFilter = tab.getAttribute("data-category");
        applyFiltersAndRender();
      });
    });

    // 経験年数セレクト
    var expSelect = document.getElementById("experience-filter");
    if (expSelect) {
      expSelect.addEventListener("change", function () {
        rankingState.experienceFilter = expSelect.value;
        applyFiltersAndRender();
      });
    }

    // 検索ボックス
    var searchInput = document.getElementById("search-filter");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        rankingState.searchQuery = searchInput.value.trim().toLowerCase();
        applyFiltersAndRender();
      });
    }
  }

  /**
   * ソートイベントのバインド
   */
  function bindSortEvents() {
    var headers = document.querySelectorAll("#ranking-table .sortable");
    headers.forEach(function (th) {
      th.addEventListener("click", function () {
        var key = th.getAttribute("data-sort");
        if (rankingState.sortKey === key) {
          rankingState.sortDir = rankingState.sortDir === "asc" ? "desc" : "asc";
        } else {
          rankingState.sortKey = key;
          rankingState.sortDir = "desc";
        }
        updateSortIcons();
        applyFiltersAndRender();
      });
    });
  }

  /**
   * ソートアイコンの更新
   */
  function updateSortIcons() {
    var headers = document.querySelectorAll("#ranking-table .sortable");
    headers.forEach(function (th) {
      var icon = th.querySelector(".sort-icon");
      var key = th.getAttribute("data-sort");
      if (key === rankingState.sortKey) {
        icon.textContent = rankingState.sortDir === "asc" ? " \u25B2" : " \u25BC";
        th.classList.add("sort-active");
      } else {
        icon.textContent = "";
        th.classList.remove("sort-active");
      }
    });
  }

  /**
   * フィルタリング + ソート + レンダリング
   */
  function applyFiltersAndRender() {
    var result = rankingState.data.slice();

    // カテゴリフィルター
    if (rankingState.categoryFilter !== "all") {
      result = result.filter(function (item) {
        return item.category === rankingState.categoryFilter;
      });
    }

    // 経験年数フィルター
    if (rankingState.experienceFilter !== "all") {
      result = result.filter(function (item) {
        return item.years === rankingState.experienceFilter;
      });
    }

    // テキスト検索
    if (rankingState.searchQuery) {
      result = result.filter(function (item) {
        return item.name.toLowerCase().indexOf(rankingState.searchQuery) !== -1 ||
               item.nameEn.toLowerCase().indexOf(rankingState.searchQuery) !== -1 ||
               item.categoryName.toLowerCase().indexOf(rankingState.searchQuery) !== -1;
      });
    }

    // ソート
    result.sort(function (a, b) {
      var valA = getSortValue(a, rankingState.sortKey);
      var valB = getSortValue(b, rankingState.sortKey);

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        if (valA < valB) return rankingState.sortDir === "asc" ? -1 : 1;
        if (valA > valB) return rankingState.sortDir === "asc" ? 1 : -1;
        return 0;
      }

      return rankingState.sortDir === "asc" ? valA - valB : valB - valA;
    });

    rankingState.filtered = result;
    renderTable(result);
    renderResultCount(result.length);
    updateSortIcons();
  }

  /**
   * ソート用の値を取得
   */
  function getSortValue(item, key) {
    switch (key) {
      case "rank":
      case "monthlyRate":
        return item.monthlyRate;
      case "name":
        return item.name;
      case "category":
        return item.categoryName;
      case "years":
        return yearsToNumber(item.years);
      case "monthlyCost":
        return item.monthlyCost;
      case "annualSalary":
        return item.annualSalary;
      case "demandScore":
        return item.demandScore;
      default:
        return item[key] || 0;
    }
  }

  /**
   * 経験年数を数値に変換（ソート用）
   */
  function yearsToNumber(years) {
    var map = { "1-3年": 1, "4-6年": 2, "7-10年": 3, "10年以上": 4 };
    return map[years] || 0;
  }

  /**
   * テーブルレンダリング
   */
  function renderTable(data) {
    var tbody = document.getElementById("ranking-body");
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--color-text-light);">該当する職種が見つかりません</td></tr>';
      return;
    }

    var html = "";
    data.forEach(function (item, i) {
      var rank = i + 1;
      var badgeClass = getCategoryBadgeClass(item.category);
      var demandBarColor = getDemandBarColor(item.demandScore);

      html +=
        '<tr>' +
          '<td class="rank rank-' + rank + '" data-label="順位">' + getRankDisplay(rank) + '</td>' +
          '<td data-label="職種名"><a href="../roles/detail.html#' + item.id + '" class="role-link"><strong>' + escapeHtml(item.name) + '</strong></a></td>' +
          '<td data-label="カテゴリ"><span class="badge ' + badgeClass + '">' + escapeHtml(item.categoryName) + '</span></td>' +
          '<td data-label="経験年数">' + escapeHtml(item.years) + '</td>' +
          '<td class="amount" data-label="請求単価">' + item.monthlyRate + '万円</td>' +
          '<td data-label="月額原価">' + item.monthlyCost + '万円</td>' +
          '<td data-label="年収">' + item.annualSalary + '万円</td>' +
          '<td data-label="需要スコア">' +
            '<div class="demand-score-cell">' +
              '<span class="demand-score-value">' + item.demandScore + '</span>' +
              '<div class="bar-chart-track" style="height:20px;">' +
                '<div class="bar-chart-fill" style="width:' + item.demandScore + '%; background:' + demandBarColor + ';"><span class="bar-chart-value">' + item.demandScore + '</span></div>' +
              '</div>' +
            '</div>' +
          '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
  }

  /**
   * 結果件数の表示
   */
  function renderResultCount(count) {
    var el = document.getElementById("result-count");
    if (!el) return;
    el.textContent = count + " 件の結果";
  }

  /**
   * 需要スコアに応じたバーの色を取得
   */
  function getDemandBarColor(score) {
    if (score >= 90) return "linear-gradient(90deg, #e53e3e 0%, #fc8181 100%)";
    if (score >= 80) return "linear-gradient(90deg, #e67e22 0%, #f6ad55 100%)";
    if (score >= 70) return "linear-gradient(90deg, #38a169 0%, #68d391 100%)";
    return "linear-gradient(90deg, #3182ce 0%, #63b3ed 100%)";
  }

  /**
   * ランクメダル表示（main.jsと同じロジック）
   */
  function getRankDisplay(rank) {
    var medals = { 1: "\uD83E\uDD47", 2: "\uD83E\uDD48", 3: "\uD83E\uDD49" };
    return medals[rank] || rank;
  }

  /**
   * カテゴリバッジクラス（main.jsと同じロジック）
   */
  function getCategoryBadgeClass(categoryKey) {
    var classMap = {
      clinical: "badge-clinical",
      data: "badge-data",
      medical: "badge-medical",
      management: "badge-management"
    };
    return classMap[categoryKey] || "badge-demand";
  }

  /**
   * HTMLエスケープ（main.jsと同じロジック）
   */
  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
});
