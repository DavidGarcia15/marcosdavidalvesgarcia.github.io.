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
})();
