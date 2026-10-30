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

  if (filterButtons.length && achievements.length) {
    var state = { ano: "todos", area: "todas" };

    function applyFilters() {
      achievements.forEach(function (item) {
        var matchesAno = state.ano === "todos" || item.dataset.ano === state.ano;
        var matchesArea = state.area === "todas" || item.dataset.area === state.area;

        if (matchesAno && matchesArea) {
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
