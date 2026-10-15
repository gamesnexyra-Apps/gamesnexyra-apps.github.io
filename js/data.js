/* ==========================================================================
   NEXYRA GAMES · Contenido editable de la web
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para:
     · Cambiar enlaces (Play Store, redes, correo de soporte)
     · Añadir / quitar juegos
     · Cambiar el estado de un juego (online / maintenance)
     · Publicar el roadmap de actualizaciones

   TEXTOS TRADUCIBLES
   Los campos de texto aceptan:
     · Un texto simple:          description: "Solo en español"
     · Un objeto por idioma:     description: { es: "Hola", en: "Hello", ... }
   Si falta un idioma se muestra el español. Idiomas: es, en, pt, fr, de, it, ja.
   Los textos de la interfaz (menús, botones, formulario) están en js/i18n.js.
   ========================================================================== */

window.NEXYRA = {
  config: {
    // Perfil de desarrollador en Google Play. Cuando tengas tu ID, usa:
    // "https://play.google.com/store/apps/dev?id=TU_ID_DE_DESARROLLADOR"
    playStoreProfile: "https://play.google.com/store/search?q=NEXYRA%20GAMES&c=apps",

    // Correo de soporte (se usa si no configuras formEndpoint)
    supportEmail: "gamesnexyra@gmail.com",

    // Opcional: endpoint para recibir el formulario sin backend propio
    // (p. ej. Formspree: "https://formspree.io/f/xxxxxxx"). Vacío = abre el correo.
    formEndpoint: "",

    // Opcional: JSON remoto con el estado de los juegos para actualizarlo
    // sin volver a publicar la web. Formato: { "bolitas": "online", "petmath": "soon" }
    // Vacío = se usa el campo "status" de cada juego de abajo.
    statusEndpoint: "",
    statusRefreshSeconds: 60,
  },

  social: [
    { name: "Discord",   url: "https://discord.gg/",    icon: "discord" },
    { name: "X",         url: "https://x.com/",         icon: "x" },
    { name: "YouTube",   url: "https://www.youtube.com/@NexyraGames",   icon: "youtube" },
    { name: "TikTok",    url: "https://tiktok.com/",    icon: "tiktok" },
  ],

  // status: "online" | "maintenance"
  // tag: "new" | "soon" | "inDev" | "workingTitle" (traducidos automáticamente) o texto libre
  // cover: ruta a imagen (se ve como icono de app). Vacío = icono automático con las iniciales.
  // color: opcional, fondo de la tarjeta (p. ej. "#fde4cf"). Vacío = uno cálido por orden.
  games: [
    {
      id: "bolitas",
      title: "Bolitas",
      genre: {
        es: "Puzle · Relajante · Para todos",
        en: "Puzzle · Relaxing · For everyone",
        pt: "Quebra-cabeça · Relaxante · Para todos",
        fr: "Puzzle · Relaxant · Pour tous",
        de: "Puzzle · Entspannend · Für alle",
        it: "Puzzle · Rilassante · Per tutti",
        ja: "パズル・リラックス・みんなで",
      },
      description: {
        es: "Ordena las bolitas de colores en sus tubos hasta que cada uno tenga un solo color. Niveles infinitos, niveles especiales con niebla, candados y jefes, animaciones cuidadas y 9 idiomas. Sin anuncios forzados y sin conexión.",
        en: "Sort the colorful balls into their tubes until each one holds a single color. Endless levels, special levels with fog, locks and bosses, polished animations and 9 languages. No forced ads, and it plays offline.",
        pt: "Ordene as bolinhas coloridas nos tubos até cada um ter uma só cor. Níveis infinitos, níveis especiais com névoa, cadeados e chefes, animações caprichadas e 9 idiomas. Sem anúncios forçados e sem internet.",
        fr: "Range les billes colorées dans leurs tubes jusqu'à ce que chacun n'ait qu'une couleur. Niveaux infinis, niveaux spéciaux avec brouillard, cadenas et boss, animations soignées et 9 langues. Sans pub forcée et hors ligne.",
        de: "Sortiere die bunten Kugeln in ihre Röhren, bis jede nur noch eine Farbe hat. Endlose Level, Spezial-Level mit Nebel, Schlössern und Bossen, liebevolle Animationen und 9 Sprachen. Ohne Zwangswerbung und offline spielbar.",
        it: "Ordina le palline colorate nei tubi finché ognuno ha un solo colore. Livelli infiniti, livelli speciali con nebbia, lucchetti e boss, animazioni curate e 9 lingue. Senza pubblicità forzata e senza connessione.",
        ja: "カラフルなボールをチューブに仕分けて、どのチューブも1色にそろえよう。無限のレベル、霧・ロック・ボスの特別レベル、こだわりのアニメーション、9か国語対応。強制広告なしでオフラインでも遊べます。",
      },
      cover: "assets/img/bolitas-cover.png",
      color: "#8b5cf6",
      page: "bolitas/",
      privacy: "bolitas/privacidad.html",
      playUrl: "", // vacío = botón «Muy pronto»; pon el enlace de Google Play al publicar
      status: "soon", // "online" al publicar
      tag: "new",
    },
    {
      id: "petmath",
      title: "PetMath",
      genre: {
        es: "Puzzle · Educativo · Mascotas",
        en: "Puzzle · Educational · Pets",
        pt: "Quebra-cabeça · Educativo · Pets",
        fr: "Puzzle · Éducatif · Animaux",
        de: "Puzzle · Lernspiel · Haustiere",
        it: "Puzzle · Educativo · Animali",
        ja: "パズル・知育・ペット",
      },
      description: {
        es: "Resuelve puzzles matemáticos, cuida a tu mascota y decora su habitación. Diseñado para peques: sin presión, sin anuncios intrusivos y 100 % sin conexión.",
        en: "Solve math puzzles, look after your pet and decorate its room. Designed for kids: no pressure, no intrusive ads and 100% offline.",
        pt: "Resolva quebra-cabeças de matemática, cuide do seu pet e decore o quarto dele. Feito para crianças: sem pressão, sem anúncios invasivos e 100% offline.",
        fr: "Résolvez des puzzles mathématiques, prenez soin de votre animal et décorez sa chambre. Conçu pour les enfants : sans pression, sans publicité intrusive et 100 % hors ligne.",
        de: "Löse Mathe-Rätsel, kümmere dich um dein Haustier und richte sein Zimmer ein. Für Kinder gemacht: kein Druck, keine aufdringliche Werbung und 100 % offline.",
        it: "Risolvi puzzle matematici, prenditi cura del tuo animaletto e decora la sua stanza. Pensato per i più piccoli: nessuna pressione, nessuna pubblicità invadente e 100% offline.",
        ja: "算数パズルを解いて、ペットのお世話をし、お部屋を飾ろう。お子さま向けに設計：プレッシャーなし、邪魔な広告なし、完全オフライン。",
      },
      cover: "assets/img/petmath-cover.png",
      playUrl: "", // vacío = botón «Muy pronto»; pon el enlace de Google Play al publicar
      status: "soon", // "soon" = aún no publicado (insignia «Próximamente»); "online" al publicar
      tag: "workingTitle", // nombre provisional; cámbialo por "new" cuando tenga nombre definitivo
    },
    {
      id: "pintipop",
      title: "Pintipop",
      genre: {
        es: "Colorear · Educativo · Niños",
        en: "Coloring · Educational · Kids",
        pt: "Colorir · Educativo · Crianças",
        fr: "Coloriage · Éducatif · Enfants",
        de: "Ausmalen · Lernspiel · Kinder",
        it: "Colorare · Educativo · Bambini",
        ja: "ぬりえ・知育・キッズ",
      },
      description: {
        es: "Colorear sin salirse de la raya: 240 dibujos en 12 categorías, pinceles mágicos de arcoíris y purpurina, pegatinas y Pinti, una gotita de pintura que anima a los peques. Sin texto: pensado para niños que aún no leen.",
        en: "Color inside the lines every time: 240 pictures in 12 categories, magic rainbow and glitter brushes, stickers and Pinti, a friendly paint drop who cheers kids on. No text: made for children who can't read yet.",
        pt: "Pinte sem sair da linha: 240 desenhos em 12 categorias, pincéis mágicos de arco-íris e purpurina, adesivos e Pinti, uma gotinha de tinta que anima as crianças. Sem texto: feito para quem ainda não lê.",
        fr: "Colorier sans dépasser : 240 dessins dans 12 catégories, pinceaux magiques arc-en-ciel et paillettes, autocollants et Pinti, une goutte de peinture qui encourage les petits. Sans texte : pour les enfants qui ne lisent pas encore.",
        de: "Ausmalen ohne Übermalen: 240 Bilder in 12 Kategorien, Zauberpinsel mit Regenbogen und Glitzer, Sticker und Pinti, ein Farbtropfen, der die Kleinen anfeuert. Ohne Text – für Kinder, die noch nicht lesen können.",
        it: "Colorare senza uscire dai bordi: 240 disegni in 12 categorie, pennelli magici arcobaleno e brillantini, adesivi e Pinti, una gocciolina di colore che incoraggia i più piccoli. Senza testo: per i bambini che non sanno ancora leggere.",
        ja: "はみ出さずにぬれるぬりえ：12カテゴリーに240枚のぬりえ、虹色やキラキラの魔法のブラシ、シール、そして子どもを応援する絵の具のしずく「ピンティ」。文字なしで、まだ字が読めない子でも遊べます。",
      },
      cover: "assets/img/pintipop-cover.png",
      privacy: "pintipop/privacidad.html",
      playUrl: "", // vacío = botón «Muy pronto»; pon el enlace de Google Play al publicar
      status: "soon", // "soon" = aún no publicado (insignia «Próximamente»); "online" al publicar
      tag: "inDev", // cámbialo por "new" al publicar
    },
  ],

  // state: "inDev" | "planned" | "released" (traducidos automáticamente) o texto libre
  // type:  "feature" | "content" | "fix" | "balance"
  // date:  AAAA-MM-DD, o "" si aún no hay fecha (sale al final como «Sin fecha»)
  // progress: 0-100, opcional (sin él no se muestra la barra)
  roadmap: [
    {
      game: "Bolitas",
      version: "v1.0",
      date: "",
      state: "inDev",
      progress: 90,
      items: [
        { type: "feature", text: {
          es: "Lanzamiento en Google Play",
          en: "Launch on Google Play",
          pt: "Lançamento no Google Play",
          fr: "Sortie sur Google Play",
          de: "Start bei Google Play",
          it: "Lancio su Google Play",
          ja: "Google Playでリリース",
        } },
        { type: "content", text: {
          es: "Niveles especiales: niebla, candado, límite de movimientos y jefes",
          en: "Special levels: fog, lock, move limit and bosses",
          pt: "Níveis especiais: névoa, cadeado, limite de movimentos e chefes",
          fr: "Niveaux spéciaux : brouillard, cadenas, limite de coups et boss",
          de: "Spezial-Level: Nebel, Schloss, Zuglimit und Bosse",
          it: "Livelli speciali: nebbia, lucchetto, limite di mosse e boss",
          ja: "特別レベル:霧、ロック、手数制限、ボス",
        } },
        { type: "content", text: {
          es: "9 idiomas, entre ellos japonés, hindi e indonesio",
          en: "9 languages, including Japanese, Hindi and Indonesian",
          pt: "9 idiomas, entre eles japonês, hindi e indonésio",
          fr: "9 langues, dont le japonais, l'hindi et l'indonésien",
          de: "9 Sprachen, darunter Japanisch, Hindi und Indonesisch",
          it: "9 lingue, tra cui giapponese, hindi e indonesiano",
          ja: "日本語、ヒンディー語、インドネシア語を含む9か国語",
        } },
      ],
    },
    {
      game: "Pintipop",
      version: {
        es: "Futuras actualizaciones",
        en: "Future updates",
        pt: "Próximas atualizações",
        fr: "Prochaines mises à jour",
        de: "Kommende Updates",
        it: "Aggiornamenti futuri",
        ja: "今後のアップデート",
      },
      date: "",
      state: "planned",
      items: [
        { type: "content", text: {
          es: "Más dibujos para colorear en nuevas categorías",
          en: "More coloring pages in new categories",
          pt: "Mais desenhos para colorir em novas categorias",
          fr: "Plus de dessins à colorier dans de nouvelles catégories",
          de: "Mehr Ausmalbilder in neuen Kategorien",
          it: "Più disegni da colorare in nuove categorie",
          ja: "新しいカテゴリーでぬりえがさらに追加",
        } },
        { type: "content", text: {
          es: "2 canciones nuevas",
          en: "2 new songs",
          pt: "2 novas músicas",
          fr: "2 nouvelles chansons",
          de: "2 neue Lieder",
          it: "2 nuove canzoni",
          ja: "新曲2曲",
        } },
        { type: "feature", text: {
          es: "Nueva función «Aprende a dibujarlo tú»: paso a paso, los niños aprenderán a dibujar desde cero los mismos dibujos que ya han coloreado",
          en: "New “Learn to draw it yourself” mode: step by step, kids will learn to draw from scratch the very same pictures they've colored",
          pt: "Novo modo «Aprenda a desenhar você mesmo»: passo a passo, as crianças vão aprender a desenhar do zero os mesmos desenhos que já coloriram",
          fr: "Nouveau mode « Apprends à le dessiner toi-même » : pas à pas, les enfants apprendront à dessiner à partir de zéro les dessins qu'ils ont déjà coloriés",
          de: "Neuer Modus „Lerne, es selbst zu zeichnen“: Schritt für Schritt lernen Kinder, die Bilder, die sie ausgemalt haben, selbst von Grund auf zu zeichnen",
          it: "Nuova modalità «Impara a disegnarlo tu»: passo dopo passo, i bambini impareranno a disegnare da zero gli stessi disegni che hanno colorato",
          ja: "新機能「じぶんでかいてみよう」：ぬった絵と同じ絵を、ゼロから一歩ずつ描けるようになります",
        } },
      ],
    },
    {
      game: "PetMath",
      version: "v1.1",
      date: "2026-11-15",
      state: "inDev",
      progress: 65,
      items: [
        { type: "content", text: {
          es: "Nueva mascota: el zorro ártico con 12 animaciones",
          en: "New pet: the arctic fox with 12 animations",
          pt: "Novo pet: a raposa-do-ártico com 12 animações",
          fr: "Nouvel animal : le renard polaire avec 12 animations",
          de: "Neues Haustier: der Polarfuchs mit 12 Animationen",
          it: "Nuovo animaletto: la volpe artica con 12 animazioni",
          ja: "新しいペット：12種類のアニメーション付きホッキョクギツネ",
        } },
        { type: "feature", text: {
          es: "Modo pintura con 20 plantillas nuevas",
          en: "Paint mode with 20 new templates",
          pt: "Modo pintura com 20 novos modelos",
          fr: "Mode peinture avec 20 nouveaux modèles",
          de: "Malmodus mit 20 neuen Vorlagen",
          it: "Modalità pittura con 20 nuovi modelli",
          ja: "20種類の新しいテンプレートを備えたお絵かきモード",
        } },
        { type: "content", text: {
          es: "Tema de interfaz «Invierno mágico»",
          en: "“Magic Winter” interface theme",
          pt: "Tema de interface «Inverno mágico»",
          fr: "Thème d'interface « Hiver magique »",
          de: "Oberflächen-Theme „Magischer Winter“",
          it: "Tema dell'interfaccia «Inverno magico»",
          ja: "インターフェーステーマ「魔法の冬」",
        } },
        { type: "fix", text: {
          es: "Corrección del arrastre de fichas en pantallas pequeñas",
          en: "Fixed tile dragging on small screens",
          pt: "Correção ao arrastar peças em telas pequenas",
          fr: "Correction du glisser-déposer des pièces sur petits écrans",
          de: "Ziehen von Spielsteinen auf kleinen Bildschirmen behoben",
          it: "Correzione del trascinamento delle tessere sugli schermi piccoli",
          ja: "小さな画面でのタイルのドラッグ操作を修正",
        } },
      ],
    },
    {
      game: "PetMath",
      version: "v1.2",
      date: "2026-12-20",
      state: "planned",
      progress: 20,
      items: [
        { type: "content", text: {
          es: "Evento de Navidad con jefe especial y juguetes exclusivos",
          en: "Christmas event with a special boss and exclusive toys",
          pt: "Evento de Natal com chefe especial e brinquedos exclusivos",
          fr: "Événement de Noël avec un boss spécial et des jouets exclusifs",
          de: "Weihnachtsevent mit Spezialboss und exklusivem Spielzeug",
          it: "Evento di Natale con boss speciale e giocattoli esclusivi",
          ja: "特別なボスと限定おもちゃが登場するクリスマスイベント",
        } },
        { type: "feature", text: {
          es: "Nuevo mapa: la Isla de las Fracciones",
          en: "New map: Fraction Island",
          pt: "Novo mapa: a Ilha das Frações",
          fr: "Nouvelle carte : l'Île des Fractions",
          de: "Neue Karte: die Bruchrechen-Insel",
          it: "Nuova mappa: l'Isola delle Frazioni",
          ja: "新マップ：分数の島",
        } },
        { type: "balance", text: {
          es: "Ajuste de la dificultad adaptativa en niveles 30–50",
          en: "Adaptive difficulty tuning for levels 30–50",
          pt: "Ajuste da dificuldade adaptativa nos níveis 30–50",
          fr: "Ajustement de la difficulté adaptative aux niveaux 30 à 50",
          de: "Feinabstimmung der adaptiven Schwierigkeit in Level 30–50",
          it: "Bilanciamento della difficoltà adattiva nei livelli 30–50",
          ja: "レベル30〜50の適応難易度を調整",
        } },
      ],
    },
  ],
};
