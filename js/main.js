/* ==========================================================================
   NEXYRA GAMES · Interactividad
   ========================================================================== */
(() => {
  "use strict";

  const DATA = window.NEXYRA;
  const CFG = DATA.config;
  const I18N = window.NEXYRA_I18N;
  const FX = window.NEXYRA_FX || { active: false }; // js/effects.js (GSAP + Lenis)
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // "soon" = juego anunciado que aún no se ha publicado (no cuenta como caído)
  const normStatus = (s) => (s === "online" ? "online" : s === "soon" ? "soon" : "maintenance");

  /* ---------------------------------------------------------------------
     Idiomas
     --------------------------------------------------------------------- */
  const LANG_KEY = "nexyra.lang";
  const SUPPORTED = I18N.languages.map((l) => l.code);
  let lang = I18N.defaultLang;

  const isSupported = (code) => SUPPORTED.includes(code);
  const langInfo = () => I18N.languages.find((l) => l.code === lang);

  function detectLang() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (isSupported(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (isSupported(saved)) return saved;
    } catch (_) { /* almacenamiento bloqueado */ }
    for (const l of navigator.languages || [navigator.language]) {
      const base = String(l || "").slice(0, 2).toLowerCase();
      if (isSupported(base)) return base;
    }
    return I18N.defaultLang;
  }

  /** Texto de la interfaz con variables {x}. Si falta, usa el idioma por defecto. */
  function t(key, vars = {}) {
    const str = I18N.strings[lang]?.[key] ?? I18N.strings[I18N.defaultLang]?.[key] ?? key;
    return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }

  /** Texto con marcado: {{destacado}} y [[marcador]]. Se escapa antes de formatear. */
  const rich = (key) =>
    esc(t(key))
      .replace(/\{\{(.+?)\}\}/g, '<em class="hl">$1</em>')
      .replace(/\[\[(.+?)\]\]/g, '<strong class="mark">$1</strong>');

  /** Campo de data.js: texto simple u objeto { es, en, ... }. */
  const L = (v) => {
    if (v == null) return "";
    if (typeof v === "object") return v[lang] ?? v[I18N.defaultLang] ?? Object.values(v)[0] ?? "";
    return String(v);
  };

  /** Clave conocida (p. ej. tag "new" → t("tag.new")) o texto libre. */
  const labelOr = (prefix, v) => {
    if (typeof v === "string" && I18N.strings[I18N.defaultLang][`${prefix}.${v}`]) return t(`${prefix}.${v}`);
    return L(v);
  };

  // El japonés usa las fuentes del sistema: la web no carga nada de servidores de terceros
  function loadJapaneseFont() {}

  function applyStaticTexts() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    $('meta[name="description"]')?.setAttribute("content", t("meta.desc"));

    $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-rich]").forEach((el) => (el.innerHTML = rich(el.dataset.i18nRich)));
    $$("[data-i18n-attr]").forEach((el) =>
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      })
    );

    const menuBtn = $("#menuBtn");
    menuBtn.setAttribute("aria-label", t(menuBtn.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));
    $("#langCode").textContent = lang.toUpperCase();
    $$(".lang-option").forEach((b) => b.setAttribute("aria-current", String(b.dataset.lang === lang)));
  }

  function setLang(code, { persist = false } = {}) {
    if (!isSupported(code)) return;
    lang = code;
    if (lang === "ja") loadJapaneseFont();

    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* sin almacenamiento */ }
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }

    FX.beforeText?.();
    applyStaticTexts();
    renderMarquee();
    renderGames();
    applyStatuses();
    renderRoadmap();
    renderGameOptions();
    $("#formMsg").classList.add("hidden");
    FX.afterText?.();
  }

  function languageSwitcher() {
    const btn = $("#langBtn");
    const menu = $("#langMenu");

    menu.innerHTML = I18N.languages
      .map((l) => `
        <li>
          <button type="button" class="lang-option" data-lang="${l.code}" lang="${l.code}" aria-current="${l.code === lang}">
            <span>${esc(l.name)}</span><span>${l.code.toUpperCase()}</span>
          </button>
        </li>`)
      .join("");

    const open = (focusFirst) => {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      if (focusFirst) ($(".lang-option[aria-current='true']", menu) || $(".lang-option", menu)).focus();
    };
    const close = (returnFocus) => {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus();
    };

    btn.addEventListener("click", () => (menu.hidden ? open(false) : close(false)));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); open(true); }
    });

    menu.addEventListener("click", (e) => {
      const opt = e.target.closest(".lang-option");
      if (!opt) return;
      setLang(opt.dataset.lang, { persist: true });
      close(true);
    });

    menu.addEventListener("keydown", (e) => {
      const opts = $$(".lang-option", menu);
      const i = opts.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
      else if (e.key === "Escape" || e.key === "Tab") close(e.key === "Escape");
    });

    document.addEventListener("click", (e) => { if (!menu.hidden && !e.target.closest("#langSwitch")) close(false); });
  }

  /* ---------------------------------------------------------------------
     Cinta de palabras (la anima effects.js: ScrollVelocity)
     --------------------------------------------------------------------- */
  function renderMarquee() {
    const item = `<span class="marquee-item">${esc(t("marquee"))}<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-spark" /></svg></span>`;
    $$(".marquee-track").forEach((track) => (track.innerHTML = item.repeat(6)));
  }

  /* ---------------------------------------------------------------------
     Navegación
     --------------------------------------------------------------------- */
  function navigation() {
    const nav = $("#navbar");
    const links = $("#navLinks");
    const btn = $("#menuBtn");
    const toTop = $("#toTop");

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", scrollY > 20);
      toTop.classList.toggle("is-visible", scrollY > innerHeight * 0.8);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const setMenu = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
      links.classList.toggle("is-open", open);
    };
    btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
    $$(".nav-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));

    toTop.addEventListener("click", () =>
      FX.active ? FX.scrollTo(0) : scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    // Enlace activo según la sección visible
    const map = new Map($$(".nav-link").map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        map.forEach((a) => a.classList.remove("is-active"));
        map.get(e.target.id)?.classList.add("is-active");
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

    // Enlaces de perfil Play Store
    $$("[data-play-profile]").forEach((a) => (a.href = CFG.playStoreProfile));
  }

  /* ---------------------------------------------------------------------
     Portada generada (si un juego no tiene imagen)
     --------------------------------------------------------------------- */
  function generatedCover(title, seed) {
    const palettes = [["#5b3df5", "#3ec5ff"], ["#8b5cf6", "#e04ff2"], ["#127fd6", "#34d399"], ["#c026d3", "#fbbf24"]];
    const [a, b] = palettes[seed % palettes.length];
    const initials = String(L(title)).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>
      <rect width="256" height="256" fill="url(#g)"/>
      <circle cx="200" cy="56" r="70" fill="#fff" fill-opacity=".14"/>
      <text x="128" y="160" text-anchor="middle" font-family="Sora, system-ui, sans-serif" font-weight="800" font-size="104" fill="#ffffff">${esc(initials)}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  const coverOf = (g, i) => g.cover || generatedCover(g.title, i);

  /* ---------------------------------------------------------------------
     Catálogo de juegos
     --------------------------------------------------------------------- */
  let gameFilter = "all";

  function badge(status, inline = false) {
    const st = normStatus(status);
    const cls = st === "online" ? "status-online" : st === "soon" ? "status-soon" : "status-maintenance";
    return `<span class="status-badge ${cls}" ${inline ? 'style="position:static"' : "data-status-badge"}><span class="dot"></span>${esc(t("st." + st))}</span>`;
  }

  function applyGameFilter() {
    $$("[data-filter]").forEach((c) => {
      const on = c.dataset.filter === gameFilter;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", String(on));
    });
    $$(".game-card").forEach((card) =>
      card.classList.toggle("is-hidden", gameFilter !== "all" && card.dataset.status !== gameFilter));
  }

  // Fondo de cada tarjeta: el "color" del juego en data.js o uno de estos por orden
  const TINTS = ["#8b5cf6", "#3ec5ff", "#e04ff2", "#34d399", "#4d7cff", "#fbbf24"];

  function renderGames() {
    const grid = $("#gamesGrid");
    // Con un solo juego: sin filtros y tarjeta centrada
    const single = DATA.games.length < 2;
    $("[data-filter]").parentElement.classList.toggle("hidden", single);
    grid.classList.toggle("is-single", single);
    grid.classList.toggle("is-pair", DATA.games.length === 2);
    grid.innerHTML = DATA.games
      .map((g, i) => {
        const hasLink = Boolean(g.playUrl);
        return `
        <article class="game-card" data-spotlight data-game="${esc(g.id)}" data-status="${normStatus(g.status)}" style="--tint:${esc(g.color || TINTS[i % TINTS.length])}">
          <span class="spot" aria-hidden="true"></span>
          <div class="game-cover">
            ${badge(g.status)}
            ${g.tag ? `<span class="game-tag">${esc(labelOr("tag", g.tag))}</span>` : ""}
            <img class="game-icon" src="${coverOf(g, i)}" alt="${esc(t("card.coverAlt", { title: L(g.title) }))}" loading="lazy" width="150" height="150" />
          </div>
          <div class="game-body">
            <p class="game-genre">${esc(L(g.genre))}</p>
            <h3 class="game-title">${esc(L(g.title))}</h3>
            <p class="game-desc">${esc(L(g.description))}</p>
            <div class="game-actions">
              <a class="btn-play ${hasLink ? "" : "is-disabled"}" ${hasLink ? `href="${esc(g.playUrl)}" target="_blank" rel="noopener"` : 'aria-disabled="true"'}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-play" /></svg>
                <span>
                  <span class="btn-play-small">${esc(t(hasLink ? "card.download" : "card.soon"))}</span>
                  <span class="btn-play-big">Google Play</span>
                </span>
              </a>
              ${g.page || g.privacy ? `<span class="game-links">${g.page ? `<a href="${esc(g.page)}">${esc(t("card.details"))}</a>` : ""}${g.privacy ? `<a href="${esc(g.privacy)}">${esc(t("card.privacy"))}</a>` : ""}</span>` : ""}
            </div>
          </div>
        </article>`;
      })
      .join("");

    applyGameFilter();
    observeReveals(grid);
    FX.cards?.(grid);
  }

  function gameFilters() {
    $$("[data-filter]").forEach((chip) =>
      chip.addEventListener("click", () => { gameFilter = chip.dataset.filter; applyGameFilter(); FX.refresh?.(); }));
  }

  /* ---------------------------------------------------------------------
     Estado en tiempo real
     --------------------------------------------------------------------- */
  let lastCheck = null;

  function applyStatuses(map) {
    if (map) {
      DATA.games.forEach((g) => { if (map[g.id]) g.status = normStatus(map[g.id]); });
      lastCheck = new Date();
    }
    lastCheck ||= new Date();

    DATA.games.forEach((g) => {
      const card = $(`.game-card[data-game="${CSS.escape(g.id)}"]`);
      if (!card) return;
      card.dataset.status = normStatus(g.status);
      $("[data-status-badge]", card).outerHTML = badge(g.status);
    });
    applyGameFilter();

    $("#statusList").innerHTML = DATA.games
      .map((g, i) => {
        const st = normStatus(g.status);
        return `
        <li class="status-row">
          <img src="${coverOf(g, i)}" alt="" class="status-icon" width="48" height="48" />
          <div>
            <p class="status-name">${esc(L(g.title))}</p>
            <p class="status-genre">${esc(L(g.genre))}</p>
          </div>
          <p class="status-text">${esc(t(st === "online" ? "st.onlineText" : st === "soon" ? "st.soonText" : "st.maintText"))}</p>
          ${badge(g.status, true)}
        </li>`;
      })
      .join("");

    // Los juegos que aún no han salido no cuentan como operativos ni como caídos
    const released = DATA.games.filter((g) => normStatus(g.status) !== "soon");
    const total = released.length;
    const down = released.filter((g) => normStatus(g.status) !== "online").length;
    $("#globalDot").className = "status-dot " + (down ? "warn" : "ok");
    $("#globalStatus").textContent = !total ? t("status.allSoon")
      : down ? t("status.partial", { ok: total - down, total, down }) : t("status.allOk");
    $("#lastCheck").textContent = lastCheck.toLocaleTimeString(langInfo().locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    updateCounters();
  }

  async function pollStatus() {
    if (!CFG.statusEndpoint) return applyStatuses();
    try {
      const res = await fetch(CFG.statusEndpoint + (CFG.statusEndpoint.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      applyStatuses(await res.json());
    } catch (err) {
      console.warn("[NEXYRA] No se pudo leer el estado remoto, uso los datos locales.", err);
      applyStatuses();
    }
  }

  /* ---------------------------------------------------------------------
     Roadmap
     --------------------------------------------------------------------- */
  let roadmapFilter = "*";

  function countdown(dateStr) {
    if (!dateStr) return t("cd.noDate");
    const target = new Date(dateStr + "T00:00:00");
    const days = Math.ceil((target - new Date()) / 86400000);
    if (days > 1) return t("cd.days", { n: days });
    if (days === 1) return t("cd.tomorrow");
    if (days === 0) return t("cd.today");
    return t("cd.released");
  }

  function applyRoadmapFilter() {
    $$("[data-rgame]").forEach((c) => c.classList.toggle("is-active", c.dataset.rgame === roadmapFilter));
    $$(".tl-item").forEach((li) => li.classList.toggle("is-hidden", roadmapFilter !== "*" && li.dataset.game !== roadmapFilter));
  }

  function renderRoadmap() {
    // Con fecha primero (por fecha); las entradas sin fecha ("date" vacío) al final
    const items = [...DATA.roadmap].sort((a, b) => (a.date ? 0 : 1) - (b.date ? 0 : 1) || (a.date || "").localeCompare(b.date || ""));
    const fmt = new Intl.DateTimeFormat(langInfo().locale, { day: "numeric", month: "long", year: "numeric" });
    const list = $("#roadmap");

    list.innerHTML = items
      .map((u) => `
      <li class="tl-item" data-game="${esc(u.game)}">
        <article class="panel tl-card">
          <div class="tl-top">
            <span class="tl-state">${esc(labelOr("state", u.state))}</span>
            <span class="countdown">${esc(countdown(u.date))}</span>
          </div>
          <h3 class="tl-title">${esc(L(u.game))} <span class="tl-version">${esc(L(u.version))}</span></h3>
          <p class="tl-eta">
            ${esc(t("updates.eta"))} ${u.date
              ? `<time datetime="${esc(u.date)}">${fmt.format(new Date(u.date + "T00:00:00"))}</time>`
              : `<strong>${esc(t("updates.tba"))}</strong>`}
          </p>
          ${typeof u.progress === "number" ? `
          <div class="progress-row">
            <div class="progress" role="progressbar" aria-valuenow="${u.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(t("updates.progress"))}">
              <span data-progress="${Math.max(0, Math.min(100, u.progress))}"></span>
            </div>
            <span class="progress-num">${u.progress}%</span>
          </div>` : ""}
          <ul class="chg-list">
            ${u.items.map((it) => `
              <li class="chg">
                <span class="chg-type chg-${esc(it.type)}">${esc(labelOr("type", it.type))}</span>
                <span>${esc(L(it.text))}</span>
              </li>`).join("")}
          </ul>
        </article>
      </li>`)
      .join("");

    const games = [...new Set(items.map((u) => u.game))];
    const filters = $("#roadmapFilters");
    filters.classList.toggle("hidden", games.length < 2);
    filters.innerHTML = [["*", t("updates.all")], ...games.map((g) => [g, g])]
      .map(([val, label]) => `<button type="button" class="chip" data-rgame="${esc(val)}">${esc(label)}</button>`)
      .join("");

    applyRoadmapFilter();
    observeReveals(list);
  }

  function roadmapFilters() {
    $("#roadmapFilters").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-rgame]");
      if (!chip) return;
      roadmapFilter = chip.dataset.rgame;
      applyRoadmapFilter();
      FX.refresh?.();
    });
  }

  /* ---------------------------------------------------------------------
     Contadores del hero
     --------------------------------------------------------------------- */
  let countersShown = false;
  function updateCounters() {
    const values = {
      games: DATA.games.length,
      online: DATA.games.filter((g) => normStatus(g.status) === "online").length,
      patches: DATA.roadmap.length,
    };
    $$("[data-count]").forEach((el) => {
      const end = values[el.dataset.count];
      if (countersShown || reduceMotion) { el.textContent = end; return; }
      if (FX.active) { FX.countTo(el, end); return; } // CountUp de effects.js
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 1200);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    countersShown = true;
  }

  /* ---------------------------------------------------------------------
     Comunidad
     --------------------------------------------------------------------- */
  const BRAND = { discord: "#5865F2", x: "#1d1a22", youtube: "#e0002b", tiktok: "#e2335a" };
  function renderSocial() {
    $("#socialList").innerHTML = DATA.social
      .map((s) => `
      <li>
        <a class="social-link" href="${esc(s.url)}" target="_blank" rel="noopener" style="--brand:${BRAND[s.icon] || "#d4683f"}">
          <span class="social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-${esc(s.icon)}" /></svg></span>
          <span>${esc(s.name)}</span>
        </a>
      </li>`)
      .join("");
    const mail = $("#supportMail");
    mail.href = "mailto:" + CFG.supportEmail;
    $("span", mail).textContent = CFG.supportEmail;
  }

  /* ---------------------------------------------------------------------
     Formulario de soporte
     --------------------------------------------------------------------- */
  function renderGameOptions() {
    const select = $("#f-game");
    const current = select.value;
    $$("option:not([value=''])", select).forEach((o) => o.remove());
    select.insertAdjacentHTML("beforeend",
      // Con un solo juego viene preseleccionado (también tras reiniciar el formulario)
      DATA.games.map((g) => `<option value="${esc(g.id)}" ${DATA.games.length === 1 ? "selected" : ""}>${esc(L(g.title))}</option>`).join(""));
    if (current) select.value = current;
  }

  function contactForm() {
    const form = $("#contactForm");
    const msg = $("#formMsg");
    const btn = $("button[type=submit]", form);
    const label = $(".btn-label", btn);

    const show = (text, ok) => {
      msg.textContent = text;
      msg.className = "form-msg " + (ok ? "is-ok" : "is-err");
    };

    const validate = (el) => {
      const field = el.closest(".field");
      if (!field) return el.checkValidity();
      const ok = el.checkValidity() && (el.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      field.classList.toggle("has-error", !ok);
      return ok;
    };

    $$("input, select, textarea", form).forEach((el) => {
      el.addEventListener("blur", () => el.value && validate(el));
      el.addEventListener("input", () => el.closest(".field")?.classList.contains("has-error") && validate(el));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = $$("[required]", form);
      const results = fields.map(validate);
      if (results.includes(false)) {
        const first = fields[results.indexOf(false)];
        first.focus();
        show(t(first.type === "checkbox" ? "form.consentErr" : "form.review"), false);
        return;
      }

      const raw = Object.fromEntries(new FormData(form));
      const game = DATA.games.find((g) => g.id === raw.game);
      const data = {
        ...raw,
        game: game ? L(game.title) : raw.game,
        topic: t("topic." + raw.topic),
        lang,
      };

      btn.disabled = true;
      label.textContent = t("form.sending");

      try {
        if (CFG.formEndpoint) {
          const res = await fetch(CFG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(res.status);
          show(t("form.ok"), true);
        } else {
          const subject = `[${data.game} · ${lang.toUpperCase()}] ${data.topic}`;
          const body = [
            `${t("form.name")}: ${data.name}`,
            `${t("form.email")}: ${data.email}`,
            `${t("form.game")}: ${data.game}`,
            `${t("form.topic")}: ${data.topic}`,
            `${t("form.device")}: ${data.device || "-"}`,
            `Lang: ${lang}`,
            "",
            data.message,
          ].join("\n");
          location.href = `mailto:${CFG.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          show(t("form.mailOpened"), true);
        }
        form.reset();
      } catch (err) {
        show(t("form.fail", { email: CFG.supportEmail }), false);
      } finally {
        btn.disabled = false;
        label.textContent = t("form.send");
      }
    });
  }

  /* ---------------------------------------------------------------------
     Apariciones al hacer scroll (con GSAP en effects.js; sin él, todo visible)
     --------------------------------------------------------------------- */
  const fillBars = (el) => $$("[data-progress]", el).forEach((bar) => (bar.style.width = bar.dataset.progress + "%"));

  const barIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      fillBars(e.target.parentElement);
      barIO.unobserve(e.target);
    }),
    { threshold: 0.3 }
  );

  function observeReveals(root = document) {
    if (FX.active) return FX.reveal(root, fillBars);
    $$("[data-progress]", root).forEach((bar) => barIO.observe(bar));
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();

    lang = detectLang();
    navigation();
    languageSwitcher();
    gameFilters();
    roadmapFilters();
    renderSocial();
    contactForm();
    setLang(lang);
    pollStatus();
    observeReveals();
    if (CFG.statusEndpoint) setInterval(pollStatus, Math.max(15, CFG.statusRefreshSeconds) * 1000);
    FX.boot?.();
  });
})();
