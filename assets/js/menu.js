/**
 * QR Menu prototype — vanilla JS
 * TODO: Rewrite in React/Next.js — see REACT_MIGRATION.md
 */

const STORAGE_KEYS = {
  saved: (slug) => `qr-menu:saved:${slug}`,
  currency: (slug) => `qr-menu:currency:${slug}`,
  language: (slug) => `qr-menu:language:${slug}`,
  feedback: (slug) => `qr-menu:feedback:${slug}`,
};

const state = {
  data: null,
  lang: "en",
  currency: "GEL",
  table: null,
  saved: new Set(),
  activeView: "home",
  activeCategory: null,
  openSheet: null,
  selectedItem: null,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function t(obj) {
  if (!obj) return "";
  return obj[state.lang] ?? obj.en ?? Object.values(obj)[0] ?? "";
}

function getLangMeta() {
  return state.data.restaurant.languages.find((l) => l.code === state.lang) ?? { rtl: false };
}

function formatPrice(priceGel) {
  const currency = state.data.restaurant.currencies.find((c) => c.code === state.currency);
  const value = priceGel * (currency?.rate ?? 1);
  const symbol = currency?.symbol ?? "";
  const formatted = state.currency === "GEL" ? value.toFixed(0) : value.toFixed(2);
  return `${symbol}${formatted}`;
}

function getShareUrl() {
  const { slug, venueId } = state.data.restaurant;
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams();
  if (state.table) params.set("table", state.table);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function loadPreferences() {
  const slug = state.data.restaurant.slug;
  const savedRaw = localStorage.getItem(STORAGE_KEYS.saved(slug));
  state.saved = new Set(savedRaw ? JSON.parse(savedRaw) : []);
  state.currency =
    localStorage.getItem(STORAGE_KEYS.currency(slug)) ??
    state.data.restaurant.defaultCurrency;
  state.lang =
    localStorage.getItem(STORAGE_KEYS.language(slug)) ??
    state.data.restaurant.defaultLanguage;
}

function persistSaved() {
  const slug = state.data.restaurant.slug;
  localStorage.setItem(STORAGE_KEYS.saved(slug), JSON.stringify([...state.saved]));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function openSheet(id) {
  state.openSheet = id;
  $("#sheet-backdrop").classList.add("is-open");
  $(`#sheet-${id}`)?.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeSheets() {
  state.openSheet = null;
  $("#sheet-backdrop").classList.remove("is-open");
  $$(".sheet").forEach((el) => el.classList.remove("is-open"));
  document.body.style.overflow = "";
}

function renderHeader() {
  const r = state.data.restaurant;
  $("#restaurant-name").textContent = t(r.name);
  $(".header__logo").src = resolveAssetPath(r.logo);

  const socialMap = {
    instagram: "#social-instagram",
    facebook: "#social-facebook",
    tripadvisor: "#social-tripadvisor",
    tiktok: "#social-tiktok",
  };
  Object.entries(r.social ?? {}).forEach(([key, url]) => {
    const el = $(socialMap[key]);
    if (el && url) el.href = url;
  });

  const tableEl = $("#table-badge");
  if (state.table) {
    tableEl.hidden = false;
    tableEl.textContent = `${t(state.data.ui.table.label)} ${state.table}`;
  } else {
    tableEl.hidden = true;
  }
}

function renderSelectors() {
  const r = state.data.restaurant;
  const currencySelect = $("#currency-select");
  currencySelect.innerHTML = r.currencies
    .map(
      (c) =>
        `<option value="${c.code}" ${c.code === state.currency ? "selected" : ""}>${c.code} ${c.symbol}</option>`
    )
    .join("");

  const langSelect = $("#language-select");
  langSelect.innerHTML = r.languages
    .map(
      (l) =>
        `<option value="${l.code}" ${l.code === state.lang ? "selected" : ""}>${l.label}</option>`
    )
    .join("");

  const rtl = getLangMeta().rtl;
  document.documentElement.lang = state.lang;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
}

function renderBanners() {
  const container = $("#banners");
  const banners = state.data.banners.filter((b) => b.enabled);
  if (!banners.length) {
    container.hidden = true;
    return;
  }
  container.hidden = false;
  container.innerHTML = banners
    .map(
      (b) => `
    <article class="banner banner--${b.layout}">
      <img class="banner__image" src="${b.image}" alt="" loading="lazy" />
      <div class="banner__content">
        <p class="banner__subheading">${t(b.subheading)}</p>
        <h2 class="banner__heading">${t(b.heading)}</h2>
        <p class="banner__text">${t(b.text)}</p>
      </div>
    </article>`
    )
    .join("");
}

function badgeHtml(key) {
  const label = t(state.data.badges[key]);
  const variant = key.replace(/[^a-z-]/g, "");
  return `<span class="badge badge--${variant}">${label}</span>`;
}

function findItemById(id) {
  for (const cat of state.data.categories) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return { item, category: cat };
  }
  return null;
}

function productCardHtml(item) {
  const saved = state.saved.has(item.id);
  return `
    <button type="button" class="product-card" data-item-id="${item.id}" aria-label="${t(item.name)}">
      <div class="product-card__image-wrap">
        <img class="product-card__image" src="${item.image}" alt="" loading="lazy" />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__title">${t(item.name)}</h3>
        <p class="product-card__desc">${t(item.description)}</p>
        <div class="product-card__meta">
          <span class="product-card__price">${formatPrice(item.priceGel)}</span>
          ${(item.badges ?? []).map(badgeHtml).join("")}
        </div>
      </div>
      <span class="save-btn ${saved ? "is-saved" : ""}" data-save-id="${item.id}" role="button" aria-label="Save" tabindex="0">
        <svg viewBox="0 0 24 24" fill="${saved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </span>
    </button>`;
}

function renderMenu() {
  const container = $("#menu-sections");
  container.innerHTML = state.data.categories
    .map(
      (cat) => `
    <section class="category-section" id="category-${cat.id}" data-category-id="${cat.id}">
      <header class="category-section__header">
        <h2 class="category-section__title">${t(cat.name)}</h2>
        <p class="category-section__desc">${t(cat.description)}</p>
      </header>
      <div class="product-list">
        ${cat.items.map(productCardHtml).join("")}
      </div>
    </section>`
    )
    .join("");

  renderCategoryNav();
}

function renderCategoryNav() {
  const nav = $("#category-nav-list");
  nav.innerHTML = state.data.categories
    .map(
      (cat, i) => `
    <button type="button" class="category-pill ${i === 0 ? "is-active" : ""}" data-category-target="${cat.id}">
      ${t(cat.name)}
    </button>`
    )
    .join("");
  state.activeCategory = state.data.categories[0]?.id ?? null;
  setupCategoryObserver();
}

function renderSavedView() {
  const list = $("#saved-list");
  const empty = $("#saved-empty");
  const ids = [...state.saved];
  $("#saved-title").textContent = t(state.data.ui.saved.title);
  empty.textContent = t(state.data.ui.saved.empty);

  if (!ids.length) {
    list.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  list.innerHTML = ids
    .map((id) => findItemById(id))
    .filter(Boolean)
    .map(({ item }) => productCardHtml(item))
    .join("");
}

function renderFeedbackView() {
  const ui = state.data.ui.feedback;
  $("#feedback-title").textContent = t(ui.title);
  $("#feedback-input").placeholder = t(ui.placeholder);
  $("#feedback-submit").textContent = t(ui.submit);
}

function renderBottomNavBadge() {
  const badge = $("#saved-count");
  const count = state.saved.size;
  if (count > 0) {
    badge.hidden = false;
    badge.textContent = count > 9 ? "9+" : String(count);
  } else {
    badge.hidden = true;
  }

  const nav = state.data.ui.nav;
  const navMap = { home: nav.home, saved: nav.saved, feedback: nav.feedback };
  $$(".bottom-nav__item").forEach((btn) => {
    const label = btn.querySelector("span:last-child");
    const key = btn.dataset.nav;
    if (label && navMap[key]) label.textContent = t(navMap[key]);
  });

  const moreUi = state.data.ui.more;
  $("#sheet-more .sheet__title").textContent = t(moreUi.title);
  $("#more-share-label").textContent = t(moreUi.share);
  $("#more-location-label").textContent = t(moreUi.location);
  $("#more-copy-label").textContent = t(state.data.ui.share.copy);
}

function setView(view) {
  state.activeView = view;
  $$(".view").forEach((el) => el.classList.toggle("is-active", el.dataset.view === view));
  $$(".bottom-nav__item").forEach((el) =>
    el.classList.toggle("is-active", el.dataset.nav === view)
  );
  if (view === "saved") renderSavedView();
}

function openProductSheet(itemId) {
  const found = findItemById(itemId);
  if (!found) return;
  const { item } = found;
  state.selectedItem = item;

  $("#sheet-product-title").textContent = t(item.name);
  $("#sheet-product-image").src = item.image;
  $("#sheet-product-image").alt = t(item.name);
  $("#sheet-product-desc").textContent = t(item.description);
  $("#sheet-product-price").textContent = formatPrice(item.priceGel);
  $("#sheet-product-badges").innerHTML = (item.badges ?? []).map(badgeHtml).join("");

  const saveBtn = $("#sheet-save-btn");
  const saved = state.saved.has(item.id);
  saveBtn.textContent = saved ? "Saved" : "Save";
  saveBtn.dataset.itemId = item.id;
  saveBtn.classList.toggle("is-saved", saved);

  openSheet("product");
}

function toggleSave(itemId, event) {
  event?.stopPropagation();
  if (state.saved.has(itemId)) state.saved.delete(itemId);
  else state.saved.add(itemId);
  persistSaved();
  renderMenu();
  if (state.activeView === "saved") renderSavedView();
  renderBottomNavBadge();
  if (state.openSheet === "product" && state.selectedItem?.id === itemId) {
    openProductSheet(itemId);
  }
}

async function shareMenu() {
  const ui = state.data.ui.share;
  const url = getShareUrl();
  const shareData = {
    title: t(state.data.restaurant.name),
    text: t(ui.text),
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      closeSheets();
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    showToast(t(ui.copied));
    closeSheets();
  } catch {
    showToast(url);
  }
}

function setupCategoryObserver() {
  const sections = $$(".category-section");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.dataset.categoryId;
      state.activeCategory = id;
      $$(".category-pill").forEach((pill) => {
        pill.classList.toggle("is-active", pill.dataset.categoryTarget === id);
      });
      const activePill = $(`.category-pill[data-category-target="${id}"]`);
      activePill?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    {
      rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim()} -${getComputedStyle(document.documentElement).getPropertyValue("--category-height").trim()} 0px 0px`,
      threshold: [0.15, 0.4, 0.7],
    }
  );

  sections.forEach((s) => observer.observe(s));
}

function bindEvents() {
  $("#currency-select").addEventListener("change", (e) => {
    state.currency = e.target.value;
    localStorage.setItem(STORAGE_KEYS.currency(state.data.restaurant.slug), state.currency);
    renderMenu();
    if (state.activeView === "saved") renderSavedView();
    if (state.openSheet === "product" && state.selectedItem) openProductSheet(state.selectedItem.id);
  });

  $("#language-select").addEventListener("change", (e) => {
    state.lang = e.target.value;
    localStorage.setItem(STORAGE_KEYS.language(state.data.restaurant.slug), state.lang);
    renderAll();
  });

  $("#category-nav-list").addEventListener("click", (e) => {
    const pill = e.target.closest(".category-pill");
    if (!pill) return;
    const id = pill.dataset.categoryTarget;
    document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("click", (e) => {
    const saveEl = e.target.closest("[data-save-id]");
    if (saveEl) {
      toggleSave(saveEl.dataset.saveId, e);
      return;
    }

    const card = e.target.closest(".product-card");
    if (card) {
      openProductSheet(card.dataset.itemId);
    }
  });

  $$(".bottom-nav__item").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.nav));
  });

  $("#btn-location").addEventListener("click", () => {
    window.open(state.data.restaurant.location.mapsUrl, "_blank", "noopener");
  });

  $("#btn-more").addEventListener("click", () => openSheet("more"));
  $("#sheet-backdrop").addEventListener("click", closeSheets);
  $$("[data-sheet-close]").forEach((el) => el.addEventListener("click", closeSheets));

  $("#btn-share-menu").addEventListener("click", shareMenu);
  $("#btn-share-more").addEventListener("click", shareMenu);
  $("#btn-location-more").addEventListener("click", () => {
    closeSheets();
    window.open(state.data.restaurant.location.mapsUrl, "_blank", "noopener");
  });

  $("#sheet-save-btn").addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.itemId;
    if (id) toggleSave(id, e);
  });

  $("#feedback-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("#feedback-input").value.trim();
    if (!text) return;
    const slug = state.data.restaurant.slug;
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.feedback(slug)) ?? "[]");
    existing.push({ text, table: state.table, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.feedback(slug), JSON.stringify(existing));
    $("#feedback-input").value = "";
    $("#feedback-success").hidden = false;
    $("#feedback-success").textContent = t(state.data.ui.feedback.success);
    $("#feedback-submit").disabled = true;
    setTimeout(() => {
      $("#feedback-success").hidden = true;
      $("#feedback-submit").disabled = false;
    }, 3000);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheets();
  });
}

function renderAll() {
  renderHeader();
  renderSelectors();
  renderBanners();
  renderMenu();
  renderFeedbackView();
  renderSavedView();
  renderBottomNavBadge();
}

function resolveAssetPath(path) {
  if (path.startsWith("http")) return path;
  return new URL(path, window.location.href).href;
}

function resolveDataUrl() {
  const script = document.currentScript;
  const configured = script?.dataset?.menuData;
  if (configured) return configured;
  return new URL("../../data/demo-restaurant.json", window.location.href).href;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  state.table = params.get("table");

  try {
    const res = await fetch(resolveDataUrl());
    if (!res.ok) throw new Error(`Failed to load menu data (${res.status})`);
    state.data = await res.json();
    loadPreferences();
    bindEvents();
    renderAll();
    setView("home");
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<main style="padding:2rem;font-family:-apple-system,sans-serif"><h1>Menu unavailable</h1><p>${err.message}</p></main>`;
  }
}

init();
