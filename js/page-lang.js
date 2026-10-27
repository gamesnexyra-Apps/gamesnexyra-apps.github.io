/* ==========================================================================
   NEXYRA GAMES · Idioma de las fichas de juego (bolitas/, pintipop/...)
   --------------------------------------------------------------------------
   Los mismos 7 idiomas que la portada. Se elige: ?lang=xx → el que se eligió en la web
   (se comparte con la portada) → idioma del navegador → español.
   · Cada texto va en un elemento con data-l="es|en|pt|fr|de|it|ja"; css/page.css muestra
     solo el del idioma activo.
   · El selector (globo + código, con la lista de idiomas) se crea en [data-langs].
   · El título de la pestaña sale de data-titles en <html> ({"es": "...", "en": "..."}).
   Se carga en <head> para que la página ya salga en su idioma.
   ========================================================================== */
(function () {
  "use strict";
  var LANGS = ["es", "en", "pt", "fr", "de", "it", "ja"];
  var NAMES = { es: "Español", en: "English", pt: "Português", fr: "Français", de: "Deutsch", it: "Italiano", ja: "日本語" };
  var LABEL = { es: "Idioma", en: "Language", pt: "Idioma", fr: "Langue", de: "Sprache", it: "Lingua", ja: "言語" };
  var KEY = "nexyra.lang";
  var root = document.documentElement;

  function valid(code) { return LANGS.indexOf(code) >= 0; }

  function detect() {
    var q = new URLSearchParams(location.search).get("lang");
    if (valid(q)) return q;
    try { var saved = localStorage.getItem(KEY); if (valid(saved)) return saved; } catch (e) { /* sin almacenamiento */ }
    var list = navigator.languages || [navigator.language || "es"];
    for (var i = 0; i < list.length; i++) {
      var base = String(list[i] || "").slice(0, 2).toLowerCase();
      if (valid(base)) return base;
    }
    return "es";
  }

  function titles() {
    try { return JSON.parse(root.getAttribute("data-titles") || "{}"); } catch (e) { return {}; }
  }

  // Enlaces a la portada ("../#contacto") llevan el idioma para que se abra igual
  function syncLinks(lang) {
    document.querySelectorAll('a[href^="../"]').forEach(function (a) {
      var raw = a.getAttribute("data-href") || a.getAttribute("href");
      a.setAttribute("data-href", raw);
      var hash = raw.indexOf("#") >= 0 ? raw.slice(raw.indexOf("#")) : "";
      if (raw.replace(/[?#].*$/, "") === "../") a.setAttribute("href", "../?lang=" + lang + hash);
    });
  }

  function setLang(lang, persist) {
    root.lang = lang;
    var t = titles();
    if (t[lang]) document.title = t[lang];
    document.querySelectorAll("[data-langs]").forEach(function (box) {
      var code = box.querySelector(".lang-code");
      if (code) code.textContent = lang.toUpperCase();
      var cur = box.querySelector(".lang-cur");
      if (cur) cur.setAttribute("aria-label", LABEL[lang] + ": " + NAMES[lang]);
      box.querySelectorAll("[data-set]").forEach(function (b) {
        b.setAttribute("aria-current", String(b.getAttribute("data-set") === lang));
      });
    });
    syncLinks(lang);
    if (persist) {
      try { localStorage.setItem(KEY, lang); } catch (e) { /* sin almacenamiento */ }
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
  }

  function buildPicker(box) {
    box.classList.add("lang-pick");
    box.innerHTML =
      '<button type="button" class="lang-cur" aria-haspopup="true" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/>' +
        '<path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></g></svg>' +
        '<span class="lang-code"></span>' +
        '<svg class="lang-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>' +
      "</button>" +
      '<ul class="lang-list" hidden>' + LANGS.map(function (l) {
        return '<li><button type="button" data-set="' + l + '" lang="' + l + '"><span>' + NAMES[l] + "</span><span>" + l.toUpperCase() + "</span></button></li>";
      }).join("") + "</ul>";

    var cur = box.querySelector(".lang-cur");
    var list = box.querySelector(".lang-list");
    var open = function (focus) {
      list.hidden = false;
      cur.setAttribute("aria-expanded", "true");
      if (focus) (list.querySelector('[aria-current="true"]') || list.querySelector("button")).focus();
    };
    var close = function (focus) {
      list.hidden = true;
      cur.setAttribute("aria-expanded", "false");
      if (focus) cur.focus();
    };
    cur.addEventListener("click", function () { if (list.hidden) open(false); else close(false); });
    cur.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
    });
    list.addEventListener("click", function (e) {
      var b = e.target.closest("[data-set]");
      if (!b) return;
      setLang(b.getAttribute("data-set"), true);
      close(true);
    });
    list.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(list.querySelectorAll("button"));
      var i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === "Escape") close(true);
      else if (e.key === "Tab") close(false);
    });
    document.addEventListener("click", function (e) { if (!list.hidden && !box.contains(e.target)) close(false); });
  }

  root.lang = detect();
  var early = titles()[root.lang];
  if (early) document.title = early;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-langs]").forEach(buildPicker);
    setLang(root.lang, false);
  });
})();
