/* ============================================
   原価計算アカデミー - CRO職種 JS
   （roles/index.html と roles/detail.html で共用）
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  if (typeof ROLE_DATA === "undefined" || typeof CATEGORIES === "undefined") return;

  // ページ判定
  var isDetailPage = !!document.getElementById("role-detail-content");
  var isListPage = !!document.getElementById("roles-list");

  if (isListPage) {
    renderRolesList();
  }

  if (isDetailPage) {
    renderRoleDetail();
    window.addEventListener("hashchange", renderRoleDetail);
  }

  /* ===========================================
     職種一覧ページ（roles/index.html）
     =========================================== */
  function renderRolesList() {
    var container = document.getElementById("roles-list");
    if (!container) return;

    var html = "";
    var categoryKeys = Object.keys(CATEGORIES);

    categoryKeys.forEach(function (catKey) {
      var cat = CATEGORIES[catKey];
      var roles = ROLE_DATA.filter(function (r) { return r.category === catKey; });
      if (roles.length === 0) return;

      html += '<section class="section fade-in" style="' + (categoryKeys.indexOf(catKey) % 2 === 1 ? 'background-color: var(--color-white);' : '') + '">';
      html += '<div class="container">';

      // カテゴリヘッダー
      html +=
        '<div class="roles-category-header">' +
          '<span class="roles-category-icon">' + cat.icon + '</span>' +
          '<div>' +
            '<h2 class="section-title" style="text-align:left;">' + escapeHtml(cat.name) +
              '<span class="roles-category-count">' + roles.length + '職種</span>' +
            '</h2>' +
            '<p class="text-light">' + escapeHtml(cat.description) + '</p>' +
          '</div>' +
        '</div>';

      // 職種カード
      html += '<div class="grid grid-2 mt-4">';
      roles.forEach(function (role) {
        var minRate = role.experienceLevels[0].monthlyRate;
        var maxRate = role.experienceLevels[role.experienceLevels.length - 1].monthlyRate;
        var descShort = role.description.length > 80 ? role.description.substring(0, 80) + "..." : role.description;
        var badgeClass = getCategoryBadgeClass(catKey);
        var demandBarColor = getDemandBarColor(role.demandScore);

        html +=
          '<div class="card role-card" style="border-left: 4px solid ' + cat.color + ';">' +
            '<div class="role-card-header">' +
              '<div>' +
                '<h3 class="card-title" style="margin-bottom:0.25rem;">' + escapeHtml(role.name) + '</h3>' +
                '<span class="text-sm text-light">' + escapeHtml(role.nameEn) + '</span>' +
              '</div>' +
              '<span class="badge ' + badgeClass + '">' + escapeHtml(cat.name) + '</span>' +
            '</div>' +
            '<p class="card-text mt-2">' + escapeHtml(descShort) + '</p>' +
            '<div class="role-card-stats">' +
              '<div class="role-card-stat">' +
                '<span class="role-card-stat-label">単価レンジ</span>' +
                '<span class="role-card-stat-value">' + minRate + '〜' + maxRate + '万円/月</span>' +
              '</div>' +
              '<div class="role-card-stat">' +
                '<span class="role-card-stat-label">需要スコア</span>' +
                '<div class="role-card-demand">' +
                  '<span class="role-card-stat-value">' + role.demandScore + '</span>' +
                  '<div class="bar-chart-track" style="height:16px; flex:1;">' +
                    '<div class="bar-chart-fill" style="width:' + role.demandScore + '%; background:' + demandBarColor + ';"></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<a href="detail.html#' + role.id + '" class="card-link">詳細を見る &rarr;</a>' +
          '</div>';
      });
      html += '</div>'; // .grid
      html += '</div>'; // .container
      html += '</section>';
    });

    container.innerHTML = html;

    // フェードインを再初期化
    initFadeInForNewElements();
  }

  /* ===========================================
     職種詳細ページ（roles/detail.html）
     =========================================== */
  function renderRoleDetail() {
    var hash = window.location.hash.replace("#", "");
    if (!hash) {
      // デフォルトは最初の職種
      hash = ROLE_DATA[0].id;
      window.location.hash = "#" + hash;
      return;
    }

    var role = ROLE_DATA.find(function (r) { return r.id === hash; });
    if (!role) {
      renderNotFound();
      return;
    }

    var cat = CATEGORIES[role.category];
    var badgeClass = getCategoryBadgeClass(role.category);

    // ヒーロー更新
    var heroTitle = document.getElementById("hero-title");
    var heroSubtitle = document.getElementById("hero-subtitle");
    var heroRoleName = document.getElementById("hero-role-name");
    if (heroTitle) heroTitle.textContent = role.name;
    if (heroSubtitle) heroSubtitle.textContent = role.nameEn;
    if (heroRoleName) heroRoleName.textContent = role.name;

    // ページタイトル更新
    document.title = role.name + " | 原価計算アカデミー";

    // メインコンテンツ
    var content = document.getElementById("role-detail-content");
    if (!content) return;

    var html = "";

    // --- 概要セクション ---
    html +=
      '<div class="detail-section card">' +
        '<div class="detail-overview-header">' +
          '<span class="badge ' + badgeClass + '">' + escapeHtml(cat.name) + '</span>' +
          '<span class="text-sm text-light">原価率: ' + role.costRatio + '%</span>' +
        '</div>' +
        '<h2>職種概要</h2>' +
        '<p>' + escapeHtml(role.description) + '</p>' +
      '</div>';

    // --- スキル & 資格 ---
    html +=
      '<div class="grid grid-2 mt-4">' +
        '<div class="card">' +
          '<h3>必要スキル</h3>' +
          '<div class="tag-list">';
    role.skills.forEach(function (skill) {
      html += '<span class="tag tag-skill">' + escapeHtml(skill) + '</span>';
    });
    html +=
          '</div>' +
        '</div>' +
        '<div class="card">' +
          '<h3>関連資格</h3>' +
          '<div class="tag-list">';
    role.qualifications.forEach(function (qual) {
      html += '<span class="tag tag-qual">' + escapeHtml(qual) + '</span>';
    });
    html +=
          '</div>' +
        '</div>' +
      '</div>';

    // --- 経験年数別テーブル ---
    html +=
      '<div class="detail-section card mt-4">' +
        '<h2>経験年数別 単価・年収</h2>' +
        '<div class="table-wrapper">' +
          '<table class="data-table">' +
            '<thead>' +
              '<tr>' +
                '<th>経験年数</th>' +
                '<th>月額原価（万円）</th>' +
                '<th>月額請求単価（万円）</th>' +
                '<th>推定年収（万円）</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>';
    role.experienceLevels.forEach(function (level) {
      html +=
              '<tr>' +
                '<td data-label="経験年数"><strong>' + escapeHtml(level.years) + '</strong></td>' +
                '<td data-label="月額原価">' + level.monthlyCost + '</td>' +
                '<td class="amount" data-label="請求単価">' + level.monthlyRate + '</td>' +
                '<td data-label="推定年収">' + level.annualSalary + '</td>' +
              '</tr>';
    });
    html +=
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    // --- 需要スコア ---
    var demandBarColor = getDemandBarColor(role.demandScore);
    html +=
      '<div class="detail-section card mt-4">' +
        '<h2>市場需要スコア</h2>' +
        '<div class="demand-display">' +
          '<div class="demand-big-score">' + role.demandScore + '<span class="demand-big-unit"> / 100</span></div>' +
          '<div class="bar-chart-track" style="height:32px;">' +
            '<div class="bar-chart-fill" style="width:' + role.demandScore + '%; background:' + demandBarColor + ';">' +
              '<span class="bar-chart-value" style="font-size:0.875rem;">' + role.demandScore + ' / 100</span>' +
            '</div>' +
          '</div>' +
          '<p class="text-sm text-light mt-2">' + getDemandDescription(role.demandScore) + '</p>' +
        '</div>' +
      '</div>';

    // --- 1日のスケジュール ---
    if (role.dailySchedule && role.dailySchedule.length > 0) {
      html +=
        '<div class="detail-section card mt-4">' +
          '<h2>1日のスケジュール</h2>' +
          '<div class="timeline">';
      role.dailySchedule.forEach(function (item, idx) {
        var isLast = idx === role.dailySchedule.length - 1;
        html +=
            '<div class="timeline-item' + (isLast ? ' timeline-item-last' : '') + '">' +
              '<div class="timeline-marker"></div>' +
              '<div class="timeline-content">' +
                '<span class="timeline-time">' + escapeHtml(item.time) + '</span>' +
                '<span class="timeline-task">' + escapeHtml(item.task) + '</span>' +
              '</div>' +
            '</div>';
      });
      html +=
          '</div>' +
        '</div>';
    }

    content.innerHTML = html;

    // --- 前後ナビ ---
    renderRoleNav(hash);

    // スクロールをトップに
    window.scrollTo(0, 0);
  }

  /**
   * 前/次の職種への遷移リンク
   */
  function renderRoleNav(currentId) {
    var nav = document.getElementById("role-nav");
    if (!nav) return;

    var currentIdx = -1;
    ROLE_DATA.forEach(function (r, i) {
      if (r.id === currentId) currentIdx = i;
    });

    var prevRole = currentIdx > 0 ? ROLE_DATA[currentIdx - 1] : null;
    var nextRole = currentIdx < ROLE_DATA.length - 1 ? ROLE_DATA[currentIdx + 1] : null;

    var html = '<div class="role-nav-inner">';

    if (prevRole) {
      html +=
        '<a href="detail.html#' + prevRole.id + '" class="role-nav-link role-nav-prev">' +
          '<span class="role-nav-direction">&larr; 前の職種</span>' +
          '<span class="role-nav-name">' + escapeHtml(prevRole.name) + '</span>' +
        '</a>';
    } else {
      html += '<div></div>';
    }

    if (nextRole) {
      html +=
        '<a href="detail.html#' + nextRole.id + '" class="role-nav-link role-nav-next">' +
          '<span class="role-nav-direction">次の職種 &rarr;</span>' +
          '<span class="role-nav-name">' + escapeHtml(nextRole.name) + '</span>' +
        '</a>';
    } else {
      html += '<div></div>';
    }

    html += '</div>';
    nav.innerHTML = html;
  }

  /**
   * 職種が見つからない場合
   */
  function renderNotFound() {
    var content = document.getElementById("role-detail-content");
    if (!content) return;

    var heroTitle = document.getElementById("hero-title");
    if (heroTitle) heroTitle.textContent = "職種が見つかりません";

    content.innerHTML =
      '<div class="card text-center" style="padding:3rem;">' +
        '<p class="text-lg mb-3">指定された職種が見つかりませんでした。</p>' +
        '<a href="index.html" class="btn btn-primary">職種一覧に戻る</a>' +
      '</div>';
  }

  /* ===========================================
     共通ユーティリティ
     =========================================== */

  function getCategoryBadgeClass(categoryKey) {
    var classMap = {
      clinical: "badge-clinical",
      data: "badge-data",
      medical: "badge-medical",
      management: "badge-management"
    };
    return classMap[categoryKey] || "badge-demand";
  }

  function getDemandBarColor(score) {
    if (score >= 90) return "linear-gradient(90deg, #e53e3e 0%, #fc8181 100%)";
    if (score >= 80) return "linear-gradient(90deg, #e67e22 0%, #f6ad55 100%)";
    if (score >= 70) return "linear-gradient(90deg, #38a169 0%, #68d391 100%)";
    return "linear-gradient(90deg, #3182ce 0%, #63b3ed 100%)";
  }

  function getDemandDescription(score) {
    if (score >= 90) return "非常に高い需要があり、人材確保が困難な状況です。";
    if (score >= 80) return "高い需要があり、経験者は引く手あまたです。";
    if (score >= 70) return "安定した需要があり、スキルアップで市場価値が上がります。";
    return "一定の需要がありますが、専門性を高めることが重要です。";
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * 動的に追加された要素にフェードインアニメーションを適用
   */
  function initFadeInForNewElements() {
    var fadeElements = document.querySelectorAll(".fade-in:not(.visible)");
    if (fadeElements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      fadeElements.forEach(function (el) { el.classList.add("visible"); });
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) { observer.observe(el); });
  }
});
