/* ==========================================================================
   NEXYRA GAMES · Movimiento
   --------------------------------------------------------------------------
   · Lenis 1.3 ........ scroll suave (sincronizado con GSAP)
   · GSAP 3.15 ........ ScrollTrigger + SplitText
   · React Bits ....... versiones en JavaScript sin React de SplitText,
                        ScrollReveal, CountUp, SpotlightCard, Magnet,
                        ScrollVelocity y AnimatedContent.
     React Bits © 2026 David Haz · MIT + Commons Clause
     https://github.com/DavidHDev/react-bits (licencia en licenses/react-bits.md)

   Si el usuario pide movimiento reducido o las librerías no cargan, no se
   anima nada y todo se ve igual (main.js usa sus alternativas).
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const FX = { active: false };
  window.NEXYRA_FX = FX;

  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !gsap || !ScrollTrigger) {
    root.classList.remove("fx");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  FX.active = true;
  window.__fxReady = true;

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  let booted = false;

  /* ---------------------------------------------------------------------
     Lenis: scroll suave con la rueda (en móvil se mantiene el táctil nativo)
     --------------------------------------------------------------------- */
  let lenis = null;
  if (Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const navOffset = () => -((document.getElementById("navbar")?.offsetHeight || 72) + 8);

  /** Desplaza a un elemento o a una posición (número). */
  FX.scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : navOffset(), duration: 1.2 });
    else if (typeof target === "number") scrollTo({ top: target, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // Enlaces internos (#seccion) con el scroll suave de Lenis
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis || a.classList.contains("skip-link")) return;
    const id = a.getAttribute("href");
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    FX.scrollTo(target);
    history.replaceState(null, "", id);
  });

  /* ---------------------------------------------------------------------
     AnimatedContent / FadeContent: aparición al entrar en pantalla
     · [data-reveal]   el elemento entero
     · [data-stagger]  sus hijos, uno detrás de otro
     --------------------------------------------------------------------- */
  const seen = new WeakSet();
  let onShow = null;

  const drawHighlights = (el) => $$(".hl", el).forEach((h) => h.classList.add("is-drawn"));
  const shown = (el) => {
    el.classList.add("is-in");
    drawHighlights(el);
    onShow?.(el);
  };
  const enterFrom = { opacity: 0, y: 34 };
  const enterTo = { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "transform" };

  FX.reveal = (scope = document, callback) => {
    if (callback) onShow = callback;

    $$("[data-reveal]", scope).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.fromTo(el, enterFrom, { ...enterTo, onStart: () => shown(el) }),
      });
    });

    const groups = scope.matches?.("[data-stagger]") ? [scope] : $$("[data-stagger]", scope);
    groups.forEach((group) => {
      // Grupo ya visible (p. ej. se vuelve a pintar al cambiar de idioma): sin animar
      if (group.dataset.in === "1") {
        const kids = [...group.children];
        if (kids.length) gsap.set(kids, { opacity: 1 });
        kids.forEach(shown);
        return;
      }
      if (seen.has(group)) return;
      seen.add(group);
      ScrollTrigger.create({
        trigger: group,
        start: "top 88%",
        once: true,
        onEnter: () => {
          group.dataset.in = "1";
          const kids = [...group.children];
          const visible = kids.filter((k) => !k.classList.contains("is-hidden"));
          const hidden = kids.filter((k) => !visible.includes(k));
          if (hidden.length) gsap.set(hidden, { opacity: 1 });
          kids.forEach(shown);
          if (visible.length) gsap.fromTo(visible, enterFrom, { ...enterTo, stagger: 0.09 });
        },
      });
    });
  };

  /* ---------------------------------------------------------------------
     SplitText: el título de la portada entra letra a letra
     --------------------------------------------------------------------- */
  let titleSplit = null;
  let introTl = null;
  const pendingCounts = [];

  function intro() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const q = (s) => $$(s, hero);
    const title = hero.querySelector("[data-split]");

    introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    introTl.to(q(".hero-blobs"), { opacity: 1, duration: 1.8, ease: "power2.out" }, 0);
    introTl.from(q(".blob"), { scale: 0.85, duration: 1.8, stagger: 0.15, ease: "power2.out" }, 0);
    introTl.fromTo(q('[data-intro="eyebrow"]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1);

    if (title && SplitText) {
      gsap.set(title, { opacity: 1 });
      titleSplit = new SplitText(title, { type: "words,chars", wordsClass: "split-word", charsClass: "split-char" });
      introTl.fromTo(titleSplit.chars, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.02 }, 0.25);
    } else if (title) {
      introTl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, 0.25);
    }

    introTl.add(() => drawHighlights(hero), ">-0.45");
    introTl.fromTo(q('[data-intro="sub"]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "<");
    introTl.fromTo(q('[data-intro="ctas"]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "<0.12");
    introTl.fromTo(q('[data-intro="stats"]'), { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8,
      onStart: () => pendingCounts.splice(0).forEach(([el, end]) => countTo(el, end)),
    }, "<0.12");
    introTl.fromTo(q('[data-intro="art"]'), { opacity: 0, scale: 0.94, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: "power2.out" }, 0.3);
    // Las etiquetas de los juegos salen del centro del emblema hacia su esquina
    const art = hero.querySelector(".hero-art");
    const fromCenter = (axis) => (i, el) => {
      if (!art) return 0;
      const a = art.getBoundingClientRect(), r = el.getBoundingClientRect();
      return axis === "x" ? (a.left + a.width / 2) - (r.left + r.width / 2) : (a.top + a.height / 2) - (r.top + r.height / 2);
    };
    introTl.fromTo(q(".float-chip"), { opacity: 0, scale: 0.3, x: fromCenter("x"), y: fromCenter("y") },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 1.1, stagger: 0.16, ease: "back.out(1.3)" }, 0.9);
  }

  /* ---------------------------------------------------------------------
     CountUp: los números de la portada cuentan hasta su valor
     --------------------------------------------------------------------- */
  function countTo(el, end) {
    const obj = { v: Number(el.textContent) || 0 };
    gsap.to(obj, { v: end, duration: 1.8, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(obj.v)) });
  }
  FX.countTo = (el, end) => {
    if (booted) countTo(el, end);
    else pendingCounts.push([el, end]);
  };

  /* ---------------------------------------------------------------------
     ScrollReveal: el manifiesto se aclara palabra a palabra con el scroll
     --------------------------------------------------------------------- */
  let statement = null;

  function scrollReveal() {
    const el = document.querySelector("[data-scroll-reveal]");
    if (!el || !SplitText) return;
    // En japonés no hay espacios: se anima carácter a carácter
    const byChar = root.lang === "ja";
    const split = new SplitText(el, { type: byChar ? "chars" : "words", wordsClass: "sr-word", charsClass: "sr-word" });
    const targets = byChar ? split.chars : split.words;
    const tweens = [
      gsap.fromTo(el, { rotate: 2, transformOrigin: "0% 50%" }, {
        rotate: 0, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 65%", scrub: true },
      }),
      gsap.fromTo(targets, { opacity: 0.12, filter: "blur(4px)" }, {
        opacity: 1, filter: "blur(0px)", ease: "none", stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true },
      }),
    ];
    statement = { split, tweens };
  }

  function undoScrollReveal() {
    if (!statement) return;
    statement.tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    statement.split.revert();
    gsap.set("[data-scroll-reveal]", { clearProps: "transform" });
    statement = null;
  }

  /* ---------------------------------------------------------------------
     SpotlightCard: luz que sigue al puntero + ligera inclinación
     --------------------------------------------------------------------- */
  FX.cards = (scope = document) => {
    if (!finePointer) return;
    $$("[data-spotlight]", scope).forEach((card) => {
      if (card._fx) return;
      card._fx = true;
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        rx((0.5 - py) * 5);
        ry((px - 0.5) * 6);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  };

  /* ---------------------------------------------------------------------
     Magnet: los botones principales se acercan un poco al puntero
     --------------------------------------------------------------------- */
  const magnets = [];
  function magnet() {
    if (!finePointer) return;
    $$("[data-magnet]").forEach((el) => {
      magnets.push({
        el,
        x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" }),
      });
    });
    const PAD = 50, STRENGTH = 3.5;
    addEventListener("pointermove", (e) => {
      magnets.forEach((m) => {
        const r = m.el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + PAD && Math.abs(dy) < r.height / 2 + PAD;
        m.x(near ? dx / STRENGTH : 0);
        m.y(near ? dy / STRENGTH : 0);
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     ScrollVelocity: la cinta de palabras se mueve sola y acelera con el scroll
     --------------------------------------------------------------------- */
  let tracks = [];
  let marqueeOn = false;
  let marqueeDir = 1;
  const BASE_SPEED = 45; // px por segundo

  FX.marquee = () => {
    tracks = $$(".marquee-track").map((track) => ({
      track,
      dir: Number(track.dataset.velocity) || 1,
      width: track.firstElementChild?.offsetWidth || 0,
      x: track._x || 0,
    }));
  };

  function marqueeLoop() {
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (marqueeOn = self.isActive),
    });
    gsap.ticker.add((time, deltaMs) => {
      if (!marqueeOn) return;
      const v = lenis ? lenis.velocity : 0;
      const factor = gsap.utils.clamp(-6, 6, v / 8);
      if (factor < 0) marqueeDir = -1;
      else if (factor > 0) marqueeDir = 1;
      tracks.forEach((t) => {
        if (!t.width) return;
        let move = marqueeDir * t.dir * BASE_SPEED * (deltaMs / 1000);
        move += move * Math.abs(factor);
        t.x = gsap.utils.wrap(-t.width, 0, t.x - move);
        t.track._x = t.x;
        t.track.style.transform = `translate3d(${t.x}px,0,0)`;
      });
    });
    addEventListener("resize", () => FX.marquee());
  }

  /* ---------------------------------------------------------------------
     Detalles: parallax de la portada, chips flotando y línea del roadmap
     --------------------------------------------------------------------- */
  function ambient() {
    // Cada etiqueta da vueltas suaves alrededor de su sitio (elipse pequeña, sentido y
    // ritmo distintos) con un ligero balanceo; empieza con amplitud 0 tras la entrada
    $$("[data-float]").forEach((el, i) => {
      const o = { a: i * 1.7, k: 0 };
      const rx = 9 + (i % 3) * 3, ry = 6 + (i % 2) * 4, dir = i % 2 ? -1 : 1;
      gsap.to(o, { k: 1, duration: 1.6, delay: 2.4, ease: "sine.inOut" });
      gsap.to(o, {
        a: o.a + Math.PI * 2 * dir, duration: 7 + i * 1.4, ease: "none", repeat: -1,
        onUpdate: () => {
          if (!o.k) return;
          gsap.set(el, { x: Math.cos(o.a) * rx * o.k, y: Math.sin(o.a) * ry * o.k, rotation: Math.sin(o.a * 2) * 1.6 * o.k });
        },
      });
    });

    gsap.to(".hero-art .arch", {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    $$(".blob").forEach((b, i) =>
      gsap.to(b, { xPercent: i % 2 ? 8 : -8, yPercent: i % 2 ? -6 : 6, duration: 9 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 }));

    const fill = document.querySelector(".tl-fill");
    if (fill) {
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".timeline-wrap", start: "top 75%", end: "bottom 65%", scrub: true },
      });
    }
  }

  /* ---------------------------------------------------------------------
     Cambio de idioma: deshacer los textos partidos y volver a partirlos
     --------------------------------------------------------------------- */
  FX.beforeText = () => {
    if (!booted) return;
    introTl?.progress(1);
    titleSplit?.revert();
    titleSplit = null;
    undoScrollReveal();
  };

  FX.afterText = () => {
    if (!booted) return;
    drawHighlights(document.querySelector(".hero"));
    $$(".is-in").forEach(drawHighlights);
    scrollReveal();
    FX.marquee();
    ScrollTrigger.refresh();
  };

  /** Tras filtrar o cambiar el tamaño del contenido. */
  FX.refresh = () => ScrollTrigger.refresh();

  /* ---------------------------------------------------------------------
     Arranque (lo llama main.js cuando los textos ya están puestos)
     --------------------------------------------------------------------- */
  FX.boot = () => {
    const fontsReady = document.fonts?.ready || Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      intro();
      scrollReveal();
      FX.marquee();
      marqueeLoop();
      magnet();
      FX.cards(document);
      ambient();
      booted = true;
      ScrollTrigger.refresh();
    });
  };
})();
