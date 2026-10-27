/* ==========================================================================
   NEXYRA GAMES · Idioma de las fichas de juego (bolitas/, pintipop/...)
   --------------------------------------------------------------------------
   Los mismos 7 idiomas que la portada. Se elige: ?lang=xx → el que se eligió en la web
   (se comparte con la portada) → idioma del navegador → español.
   Cada texto va en un elemento con data-l="es|en|pt|fr|de|it|ja"; css/page.css muestra
   solo el del idioma activo. Los botones se crean en <nav class="langs" data-langs>.
   Se carga en <head> para que la página ya salga en su idioma.
   ========================================================================== */
(function () {
  "use strict";
  var LANGS = ["es", "en", "pt", "fr", "de", "it", "ja"];
  var NAMES = { es: "Español", en: "English", pt: "Português", fr: "Français", de: "Deutsch", it: "Italiano", ja: "日本語" };
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

  // Enlaces a la portada ("../#contacto") llevan el idioma para que se abra igual
  function syncLinks(lang) {
    document.querySelectorAll('a[href^="../"]').forEach(function (a) {
      var raw = a.dataset.href || a.getAttribute("href");
      a.dataset.href = raw;
      var hash = raw.indexOf("#") >= 0 ? raw.slice(raw.indexOf("#")) : "";
      var path = raw.replace(/[?#].*$/, "");
      if (path === "../") a.setAttribute("href", path + "?lang=" + lang + hash);
    });
  }

  function setLang(lang, persist) {
    root.lang = lang;
    document.querySelectorAll("[data-langs] button").forEach(function (b) {
      var on = b.dataset.set === lang;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    syncLinks(lang);
    if (persist) {
      try { localStorage.setItem(KEY, lang); } catch (e) { /* sin almacenamiento */ }
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
  }

  root.lang = detect();

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-langs]").forEach(function (nav) {
      nav.innerHTML = LANGS.map(function (l) {
        return '<button type="button" data-set="' + l + '" lang="' + l + '" title="' + NAMES[l] + '">' + l.toUpperCase() + "</button>";
      }).join("");
      nav.addEventListener("click", function (e) {
        var b = e.target.closest("[data-set]");
        if (b) setLang(b.dataset.set, true);
      });
    });
    setLang(root.lang, false);
  });
})();
