/*
 * Marcos David Alves Garcia — Portfólio Acadêmico
 * Scripts leves: menu mobile + filtros da página de conquistas.
 *
 * Importante para SEO: os filtros abaixo apenas ocultam visualmente
 * cartões com [hidden] — todo o conteúdo continua presente no HTML
 * publicado e pode ser lido por mecanismos de busca mesmo sem JS.
 */

(function () {
  "use strict";

  // ---------- Menu mobile ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // ---------- Filtros da página de conquistas ----------
  var filterButtons = document.querySelectorAll(".filter-btn");
  var achievements = document.querySelectorAll(".achievement");
  var filterStatus = document.getElementById("filter-status");

  if (filterButtons.length && achievements.length) {
    var state = { ano: "todos", area: "todas" };

    function applyFilters() {
      var visibleCount = 0;
      achievements.forEach(function (item) {
        var matchesAno = state.ano === "todos" || item.dataset.ano === state.ano;
        var matchesArea = state.area === "todas" || item.dataset.area === state.area;

        if (matchesAno && matchesArea) {
          visibleCount += 1;
          item.removeAttribute("hidden");
        } else {
          item.setAttribute("hidden", "");
        }
      });

      // Oculta o título do ano quando nenhum item daquele ano está visível
      document.querySelectorAll(".year-group").forEach(function (group) {
        var visible = group.querySelectorAll(".achievement:not([hidden])");
        group.style.display = visible.length ? "" : "none";
      });

      if (filterStatus) {
        if (visibleCount === 0) {
          filterStatus.textContent = "Nenhum registro encontrado com essa combinação de filtros.";
        } else if (visibleCount === achievements.length) {
          filterStatus.textContent = "Mostrando todos os " + visibleCount + " registros.";
        } else {
          filterStatus.textContent = "Mostrando " + visibleCount + " de " + achievements.length + " registros.";
        }
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.dataset.filterGroup;
        var value = btn.dataset.filterValue;

        state[group] = value;

        document
          .querySelectorAll('.filter-btn[data-filter-group="' + group + '"]')
          .forEach(function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });

        applyFilters();
      });
    });

    applyFilters();
  }

  // ---------- Galeria "Um céu de conquistas" ----------
  // Painel de detalhes: cada medalha tem um <template> com o conteúdo real
  // (já publicado em /conquistas/); o diálogo nativo <dialog> cuida de foco,
  // Esc para fechar e leitura por teclado sem bibliotecas externas.
  var skyGallery = document.querySelector(".sky-gallery");
  var medalButtons = document.querySelectorAll(".medal-star, .trajectory-card");
  var medalDialog = document.getElementById("medal-dialog");
  var medalDialogContent = medalDialog ? medalDialog.querySelector(".medal-dialog-content") : null;

  if (medalButtons.length && medalDialog && medalDialogContent) {
    medalButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tpl = document.getElementById(btn.getAttribute("data-template"));
        if (!tpl) {
          return;
        }
        medalDialogContent.innerHTML = "";
        medalDialogContent.appendChild(tpl.content.cloneNode(true));
        if (typeof medalDialog.showModal === "function") {
          medalDialog.showModal();
        } else {
          medalDialog.setAttribute("open", "");
        }
      });
    });
  }

  // Entrada suave das medalhas quando a seção aparece na tela (uma única vez)
  if (skyGallery) {
    if ("IntersectionObserver" in window) {
      var skyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              skyGallery.classList.add("is-visible");
              skyObserver.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      skyObserver.observe(skyGallery);
    } else {
      skyGallery.classList.add("is-visible");
    }
  }
})();

/*
 * ---------- Seção "Minha Trajetória" ----------
 * A caneta percorre o traço dourado uma única vez quando a seção entra
 * na tela (igual ao padrão da galeria acima), desenhando a linha com
 * stroke-dashoffset e acompanhando a ponta com getPointAtLength.
 * Por padrão (sem JS, ou com prefers-reduced-motion) todo o conteúdo já
 * aparece completo — a animação só esconde os cartões momentos antes de
 * revelá-los, nunca ao carregar a página.
 */
(function () {
  "use strict";

  var section = document.querySelector(".trajectory");
  if (!section) {
    return;
  }

  var inkPath = section.querySelector(".trajectory-path-ink");
  var pen = section.querySelector(".trajectory-pen");
  var markers = Array.prototype.slice.call(section.querySelectorAll(".trajectory-marker"));

  // uma fração (0 a 1) do comprimento do traço por marco, na ordem do DOM
  var fracoes = [0.1, 0.3, 0.5, 0.7, 0.9];

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !inkPath || !("IntersectionObserver" in window)) {
    return;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animar() {
    var total = inkPath.getTotalLength();
    inkPath.style.strokeDasharray = String(total);
    inkPath.style.strokeDashoffset = String(total);
    if (pen) {
      pen.classList.add("is-drawing");
    }

    // esconde os cartões só agora, logo antes de começar a desenhar
    markers.forEach(function (li) {
      var card = li.querySelector(".trajectory-card");
      if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        card.style.transition =
          "opacity .5s ease, transform .5s ease, border-color var(--speed), background var(--speed)";
      }
    });

    var DURACAO = 12000;
    var inicio = null;
    var revelados = {};

    function quadro(agora) {
      if (inicio === null) {
        inicio = agora;
      }
      var bruto = Math.min((agora - inicio) / DURACAO, 1);
      var t = easeInOutCubic(bruto);

      inkPath.style.strokeDashoffset = String(total * (1 - t));

      var ponto = inkPath.getPointAtLength(t * total);
      if (pen) {
        pen.setAttribute("transform", "translate(" + ponto.x + " " + ponto.y + ")");
      }

      fracoes.forEach(function (fracao, indice) {
        if (!revelados[indice] && bruto >= fracao) {
          revelados[indice] = true;
          setTimeout(function () {
            var li = markers[indice];
            var card = li ? li.querySelector(".trajectory-card") : null;
            if (li) {
              li.classList.add("is-visible");
            }
            if (card) {
              card.style.opacity = "";
              card.style.transform = "";
            }
          }, 150);
        }
      });

      if (bruto < 1) {
        requestAnimationFrame(quadro);
      } else if (pen) {
        pen.classList.remove("is-drawing");
      }
    }

    requestAnimationFrame(quadro);
  }

  var jaAnimou = false;
  var trajectoryObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !jaAnimou) {
          jaAnimou = true;
          animar();
          trajectoryObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  trajectoryObserver.observe(section);
})();


/* Animação da nova trilha vertical da Minha Trajetória */
(function () {
  "use strict";
  var track = document.querySelector(".journey-track");
  if (!track) return;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        track.classList.add("is-animating");
        observer.disconnect();
      }
    });
  }, { threshold: 0.12 });
  observer.observe(track);
})();


/* =====================================================================
   Camada de movimento global — céu, rolagem, cartões e navegação
   ===================================================================== */
(function () {
  "use strict";

  var body = document.body;
  if (!body) return;

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Fundo estrelado: pontos independentes sobre a pintura original. */
  var cosmos = document.createElement("div");
  cosmos.className = "ambient-cosmos";
  cosmos.setAttribute("aria-hidden", "true");

  var starCount = reducedMotion ? 34 : 58;
  for (var i = 0; i < starCount; i += 1) {
    var star = document.createElement("span");
    star.className = "cosmic-star";
    star.style.setProperty("--star-x", (Math.random() * 100).toFixed(2) + "%");
    star.style.setProperty("--star-y", (Math.random() * 100).toFixed(2) + "%");
    star.style.setProperty("--star-size", (Math.random() * 2.2 + 1).toFixed(2) + "px");
    star.style.setProperty("--star-delay", (-Math.random() * 12).toFixed(2) + "s");
    star.style.setProperty("--star-duration", (8 + Math.random() * 13).toFixed(2) + "s");
    star.style.setProperty("--glimmer-duration", (3.4 + Math.random() * 4.8).toFixed(2) + "s");
    star.style.setProperty("--drift-x", ((Math.random() - .5) * 34).toFixed(1) + "px");
    star.style.setProperty("--drift-y", ((Math.random() - .5) * 42).toFixed(1) + "px");
    cosmos.appendChild(star);
  }
  body.insertBefore(cosmos, body.firstChild);

  /* Indicador de leitura no topo da janela. */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.appendChild(progress);

  var scrollFrame = 0;
  function updateScrollDecorations() {
    var maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    if (!reducedMotion) {
      cosmos.style.transform = "translate3d(0," + (-window.scrollY * .035).toFixed(1) + "px,0)";
    }
    scrollFrame = 0;
  }

  function requestScrollUpdate() {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateScrollDecorations);
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollDecorations();

  /* Aura que acompanha o cursor sem interferir na interação. */
  if (!reducedMotion) {
    window.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;
      cosmos.style.setProperty("--aura-x", event.clientX + "px");
      cosmos.style.setProperty("--aura-y", event.clientY + "px");
    }, { passive: true });
  }

  /* Scroll reveal com atraso em cascata: os seletores correspondem às
     classes realmente usadas nas páginas do repositório. */
  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealTargets = document.querySelectorAll(
      ".highlight-card, .achievement-card, .area-list li, .source-list li, " +
      ".about-section h2, .about-section p, .about-section .callout, " +
      ".project-note, .journey-heading, .journey-closing"
    );

    revealTargets.forEach(function (element, index) {
      element.classList.add("reveal-item");
      element.style.setProperty("--reveal-delay", ((index % 5) * 85) + "ms");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px"
    });

    revealTargets.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  /* Inclinação 3D dos cartões em mouse/trackpad. */
  if (!reducedMotion) {
    var tiltCards = document.querySelectorAll(
      ".highlight-card, .achievement-card, .journey-card.trajectory-card"
    );

    tiltCards.forEach(function (card) {
      card.classList.add("interactive-tilt");

      card.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = ((x - .5) * 10).toFixed(2);
        var rotateX = ((.5 - y) * 8).toFixed(2);

        card.style.setProperty("--tilt-x", rotateY + "deg");
        card.style.setProperty("--tilt-y", rotateX + "deg");
      });

      card.addEventListener("pointerleave", function () {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  /* Pequena onda de luz ao clicar em botões e filtros. */
  document.querySelectorAll(".btn, .filter-btn, .nav-toggle, .medal-dialog-close")
    .forEach(function (control) {
      control.addEventListener("click", function (event) {
        if (reducedMotion) return;

        var rect = control.getBoundingClientRect();
        var ripple = document.createElement("span");
        var diameter = Math.max(rect.width, rect.height) * 1.55;
        ripple.className = "interaction-ripple";
        ripple.style.width = diameter + "px";
        ripple.style.height = diameter + "px";
        ripple.style.left = (
          event.clientX ? event.clientX - rect.left : rect.width / 2
        ) + "px";
        ripple.style.top = (
          event.clientY ? event.clientY - rect.top : rect.height / 2
        ) + "px";

        control.appendChild(ripple);
        ripple.addEventListener("animationend", function () {
          ripple.remove();
        }, { once: true });
      });
    });

  /* Transição de saída somente para páginas do próprio portfólio.
     Links externos, downloads, âncoras e novas abas mantêm seu comportamento. */
  if (!reducedMotion) {
    var leaving = false;

    document.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (
          leaving ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank" ||
          link.hasAttribute("download")
        ) {
          return;
        }

        var href = link.getAttribute("href");
        if (!href || href.charAt(0) === "#") return;

        var destination;
        try {
          destination = new URL(link.href, window.location.href);
        } catch (error) {
          return;
        }

        if (destination.origin !== window.location.origin) return;

        var samePath = destination.pathname === window.location.pathname &&
          destination.search === window.location.search;
        if (samePath) return;

        event.preventDefault();
        leaving = true;
        body.classList.add("page-leaving");

        window.setTimeout(function () {
          window.location.assign(destination.href);
        }, 250);
      });
    });
  }
})();
