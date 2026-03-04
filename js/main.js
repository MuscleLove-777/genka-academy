/* ============================================
   原価計算アカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initNavDropdown();
  initTop8Table();
  initCategoryCards();
  initTermCards();
  initSmoothScroll();
  initFadeInAnimation();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    var isOpen = mobileMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // メニュー内リンククリックで閉じる
  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- デスクトップナビ ドロップダウン --- */
function initNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    // クリックで開閉
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      // 他のドロップダウンを閉じる
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });

    // ホバーで開閉（デスクトップ）
    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.add("active");
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove("active");
      }
    });
  });

  // ドキュメントクリックで全ドロップダウンを閉じる
  document.addEventListener("click", function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  });
}

/* --- ランクメダル表示 --- */
function getRankDisplay(rank) {
  var medals = { 1: "\uD83E\uDD47", 2: "\uD83E\uDD48", 3: "\uD83E\uDD49" };
  return medals[rank] || rank;
}

/* --- カテゴリ名取得 --- */
function getCategoryName(categoryKey) {
  if (typeof CATEGORIES === "undefined" || !CATEGORIES[categoryKey]) return "";
  return CATEGORIES[categoryKey].name;
}

/* --- カテゴリバッジクラス取得 --- */
function getCategoryBadgeClass(categoryKey) {
  var classMap = {
    clinical: "badge-clinical",
    data: "badge-data",
    medical: "badge-medical",
    management: "badge-management"
  };
  return classMap[categoryKey] || "badge-demand";
}

/* --- TOP8 単価ランキングテーブル生成 --- */
function initTop8Table() {
  var tableBody = document.getElementById("top8-body");
  if (!tableBody || typeof ROLE_DATA === "undefined") return;

  // 7-10年経験の請求単価でソート（降順）
  var sorted = ROLE_DATA.slice()
    .map(function (role) {
      // 7-10年の経験レベルを取得
      var level = role.experienceLevels.find(function (lv) {
        return lv.years === "7-10年";
      });
      return {
        id: role.id,
        name: role.name,
        category: role.category,
        monthlyRate: level ? level.monthlyRate : 0,
        monthlyCost: level ? level.monthlyCost : 0,
        costRatio: role.costRatio,
        demandScore: role.demandScore
      };
    })
    .sort(function (a, b) {
      return b.monthlyRate - a.monthlyRate;
    });

  var html = "";
  sorted.forEach(function (role, i) {
    var rank = i + 1;
    var categoryName = getCategoryName(role.category);
    var badgeClass = getCategoryBadgeClass(role.category);

    html +=
      '<tr>' +
        '<td class="rank rank-' + rank + '" data-label="順位">' + getRankDisplay(rank) + '</td>' +
        '<td data-label="職種名"><strong>' + escapeHtml(role.name) + '</strong></td>' +
        '<td data-label="カテゴリ"><span class="badge ' + badgeClass + '">' + escapeHtml(categoryName) + '</span></td>' +
        '<td class="amount" data-label="請求単価">' + role.monthlyRate + '万円</td>' +
        '<td data-label="月額原価">' + role.monthlyCost + '万円</td>' +
        '<td data-label="原価率">' +
          '<div class="bar-chart-track" style="height:20px;">' +
            '<div class="bar-chart-fill" style="width:' + role.costRatio + '%;"><span class="bar-chart-value">' + role.costRatio + '%</span></div>' +
          '</div>' +
        '</td>' +
      '</tr>';
  });

  tableBody.innerHTML = html;
}

/* --- CRO職種カテゴリカード生成 --- */
function initCategoryCards() {
  var container = document.getElementById("category-cards");
  if (!container || typeof CATEGORIES === "undefined") return;

  var html = "";
  var keys = Object.keys(CATEGORIES);

  keys.forEach(function (key) {
    var cat = CATEGORIES[key];

    // 該当職種数を取得
    var roleCount = 0;
    if (typeof ROLE_DATA !== "undefined") {
      roleCount = ROLE_DATA.filter(function (r) {
        return r.category === key;
      }).length;
    }

    html +=
      '<div class="card category-card" style="border-left-color:' + cat.color + ';" data-category="' + key + '">' +
        '<div class="card-icon">' + cat.icon + '</div>' +
        '<div class="card-title">' + escapeHtml(cat.name) + '</div>' +
        '<p class="card-text">' + escapeHtml(cat.description) + '</p>' +
        '<div class="card-subtitle">' + escapeHtml(cat.rateRange) + '</div>' +
        '<span class="text-sm text-light">' + roleCount + '職種</span>' +
        '<a href="roles/index.html" class="card-link">詳しく見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 原価計算用語カード生成（主要4つ） --- */
function initTermCards() {
  var container = document.getElementById("term-cards");
  if (!container || typeof COST_TERMS === "undefined") return;

  // 主要4つの用語を表示
  var mainTerms = COST_TERMS.slice(0, 4);

  var html = "";
  mainTerms.forEach(function (item) {
    html +=
      '<div class="card term-card">' +
        '<div class="term-name">' + escapeHtml(item.term) + '</div>' +
        '<div class="term-definition">' + escapeHtml(item.definition) + '</div>' +
        '<div class="term-formula">' + escapeHtml(item.formula) + '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- スムーズスクロール --- */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

/* --- フェードインアニメーション（Intersection Observer） --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  // Intersection Observer が使えない場合はすべて表示
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

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* --- ユーティリティ: 数値フォーマット --- */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
