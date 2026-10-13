(function () {
  "use strict";

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var initials = function (name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  };
  var avatar = function (m) {
    return '<span class="avatar">' +
      (m.foto ? '<img src="' + esc(m.foto) + '" alt="Foto de ' + esc(m.nombre) + '" loading="lazy">' : esc(initials(m.nombre))) +
      "</span>";
  };
  var list = function (items) {
    return "<ul>" + (items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  };

  // Menú móvil
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); }
  });

  // Rejilla de puntos del gráfico del hero
  var grid = document.querySelector(".hero__chart .grid");
  if (grid) {
    var ns = "http://www.w3.org/2000/svg";
    for (var r = 0; r < 5; r++) for (var c = 0; c < 14; c++) {
      var d = document.createElementNS(ns, "circle");
      d.setAttribute("cx", 8 + c * 23); d.setAttribute("cy", 8 + r * 24); d.setAttribute("r", 1.5);
      grid.appendChild(d);
    }
  }

  // Equipo
  var team = window.TEAM || [];
  var teamEl = document.getElementById("team");
  teamEl.innerHTML = team.map(function (m, i) {
    return '<button class="member reveal" data-i="' + i + '" data-area="' + esc(m.area) + '" aria-haspopup="dialog">' +
      avatar(m) +
      '<span class="member__area">' + esc(m.area) + "</span>" +
      "<h3>" + esc(m.nombre) + "</h3>" +
      '<span class="member__role">' + esc(m.cargo) + "</span>" +
      '<span class="tags">' + (m.especialidades || []).slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</span>" +
      '<span class="member__more">Ver perfil →</span>' +
      "</button>";
  }).join("");

  // Filtros por área
  var areas = ["Todos"].concat(team.map(function (m) { return m.area; }).filter(function (a, i, arr) { return a && arr.indexOf(a) === i; }));
  var filters = document.querySelector(".filters");
  filters.innerHTML = areas.map(function (a, i) {
    return '<button class="chip" aria-pressed="' + (i === 0) + '" data-area="' + esc(a) + '">' + esc(a) + "</button>";
  }).join("");
  filters.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    filters.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    var area = b.dataset.area;
    teamEl.querySelectorAll(".member").forEach(function (m) { m.hidden = area !== "Todos" && m.dataset.area !== area; });
  });

  // Perfil (modal)
  var dlg = document.getElementById("profile");
  var body = dlg.querySelector(".modal__body");
  teamEl.addEventListener("click", function (e) {
    var card = e.target.closest(".member"); if (!card) return;
    var m = team[+card.dataset.i];
    var links = "";
    if (m.linkedin) links += '<a class="btn btn--ghost btn--sm" href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>';
    if (m.correo) links += '<a class="btn btn--sm" href="mailto:' + esc(m.correo) + '">Escribir</a>';
    body.innerHTML =
      '<div class="modal__top">' + avatar(m) + "<div>" +
        '<span class="member__area">' + esc(m.area) + "</span>" +
        '<h2 id="profile-name">' + esc(m.nombre) + "</h2>" +
        '<p class="member__role">' + esc(m.cargo) + "</p></div></div>" +
      '<p class="modal__summary">' + esc(m.resumen) + "</p>" +
      '<div class="cv"><div><h4>Formación</h4>' + list(m.formacion) + "</div>" +
      "<div><h4>Experiencia</h4>" + list(m.experiencia) + "</div></div>" +
      '<div class="tags">' + (m.especialidades || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      (links ? '<div class="modal__links">' + links + "</div>" : "");
    dlg.showModal();
  });
  dlg.querySelector(".modal__close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  // Contadores y revelado al hacer scroll
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var count = function (el) {
    var target = +el.dataset.count;
    if (reduce) { el.textContent = target; return; }
    var t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.querySelectorAll(".card, .steps li, .stat").forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        var n = en.target.querySelector("[data-count]");
        if (n) count(n);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    document.querySelectorAll("[data-count]").forEach(count);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
