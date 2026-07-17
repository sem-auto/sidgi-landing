// SIDGI — script.js
// Navegación, año de pie de página y demostraciones ficticias (sin backend, sin persistencia).

document.addEventListener('DOMContentLoaded', function () {
  /* ---------- Año en el pie de página ---------- */
  document.querySelectorAll('#year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header con sombra al hacer scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Animación de aparición al hacer scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.card, .step, .case-card, .price-card, .company-card, .demo-shell, .cta-band, .section-head, .problem-list li'
  );
  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('reveal-visible'); });
  }

  /* ---------- Menú móvil ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---------- Desplegable "Soluciones" (touch/click) ---------- */
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dropdown = btn.closest('.nav-dropdown');
      var isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-dropdown.open').forEach(function (dropdown) {
      if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });
  });

  /* =========================================================
     DEMO 1 — Control horario (datos ficticios, no se guardan)
     ========================================================= */
  var clockDemo = document.getElementById('demo-fichajes');
  if (clockDemo) {
    var workers = ['Marta G.', 'Javier R.', 'Ana P.'];
    var selectedWorker = workers[0];
    var records = [];

    var workerButtons = clockDemo.querySelectorAll('.demo-worker-btn');
    var msg = clockDemo.querySelector('.demo-message');
    var tableBody = clockDemo.querySelector('tbody');
    var btnIn = clockDemo.querySelector('[data-action="entrada"]');
    var btnOut = clockDemo.querySelector('[data-action="salida"]');

    workerButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        workerButtons.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedWorker = btn.textContent.trim();
      });
    });

    function nowLabel() {
      var d = new Date();
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    function addRecord(tipo) {
      records.unshift({ trabajador: selectedWorker, tipo: tipo, hora: nowLabel() });
      renderTable();
      msg.textContent = selectedWorker + ' ha fichado ' + tipo + ' a las ' + nowLabel() + '.';
    }

    function renderTable() {
      tableBody.innerHTML = '';
      records.slice(0, 6).forEach(function (r) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + r.trabajador + '</td><td>' + r.tipo + '</td><td>' + r.hora + '</td>';
        tableBody.appendChild(tr);
      });
    }

    if (btnIn) btnIn.addEventListener('click', function () { addRecord('entrada'); });
    if (btnOut) btnOut.addEventListener('click', function () { addRecord('salida'); });
  }

  /* =========================================================
     DEMO 2 — Bonos y clientes (datos ficticios, no se guardan)
     ========================================================= */
  var bonoDemo = document.getElementById('demo-bonos');
  if (bonoDemo) {
    var clients = [
      { nombre: 'Laura Martínez', bono: '5 consultas', importe: '150 €', usadas: 2, total: 5, estado: 'Activo' },
      { nombre: 'Pedro Sánchez', bono: '10 sesiones', importe: '220 €', usadas: 7, total: 10, estado: 'Activo' },
      { nombre: 'Marina Ruiz', bono: '3 sesiones', importe: '90 €', usadas: 3, total: 3, estado: 'Finalizado' }
    ];

    var searchInput = bonoDemo.querySelector('.demo-client-search input');
    var listEl = bonoDemo.querySelector('.demo-client-list');
    var cardEl = bonoDemo.querySelector('.demo-client-card');
    var confirmEl = bonoDemo.querySelector('.demo-message');
    var activeIndex = 0;

    function renderList(filter) {
      listEl.innerHTML = '';
      clients
        .map(function (c, i) { return { c: c, i: i }; })
        .filter(function (item) { return !filter || item.c.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1; })
        .forEach(function (item) {
          var div = document.createElement('div');
          div.className = 'demo-client-item';
          div.innerHTML = '<span>' + item.c.nombre + '</span><span class="pill' + (item.c.estado === 'Activo' ? '' : ' pill-neutral') + '">' + item.c.estado + '</span>';
          div.addEventListener('click', function () {
            activeIndex = item.i;
            renderCard();
            confirmEl.textContent = '';
          });
          listEl.appendChild(div);
        });
    }

    function renderCard() {
      var c = clients[activeIndex];
      var restantes = c.total - c.usadas;
      var pct = Math.round((c.usadas / c.total) * 100);
      cardEl.innerHTML =
        '<div class="row"><span>Cliente</span><span><strong>' + c.nombre + '</strong></span></div>' +
        '<div class="row"><span>Bono</span><span>' + c.bono + '</span></div>' +
        '<div class="row"><span>Importe</span><span>' + c.importe + '</span></div>' +
        '<div class="row"><span>Sesiones usadas</span><span>' + c.usadas + ' de ' + c.total + '</span></div>' +
        '<div class="demo-sessions-bar"><div class="demo-sessions-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="row"><span>Sesiones restantes</span><span><strong>' + restantes + '</strong></span></div>' +
        '<div class="row"><span>Estado</span><span class="pill' + (c.estado === 'Activo' ? '' : ' pill-neutral') + '">' + c.estado + '</span></div>' +
        '<button type="button" class="btn btn-primary btn-block" data-action="registrar" ' + (restantes <= 0 ? 'disabled' : '') + '>Registrar sesión</button>';

      var registerBtn = cardEl.querySelector('[data-action="registrar"]');
      registerBtn.addEventListener('click', function () {
        if (c.usadas < c.total) {
          c.usadas += 1;
          renderCard();
          confirmEl.textContent = 'Sesión registrada para ' + c.nombre + '. Quedan ' + (c.total - c.usadas) + '.';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderList(searchInput.value);
      });
    }

    renderList('');
    renderCard();
  }

  /* =========================================================
     Formulario de contacto — WhatsApp o correo, sin backend
     ========================================================= */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var setError = function (id, message) {
      var el = document.getElementById('err-' + id);
      var field = document.getElementById(id);
      if (!el) return;
      if (message) {
        el.textContent = message;
        el.hidden = false;
        el.setAttribute('role', 'alert');
        if (field) field.setAttribute('aria-invalid', 'true');
      } else {
        el.textContent = '';
        el.hidden = true;
        el.removeAttribute('role');
        if (field) field.removeAttribute('aria-invalid');
      }
    };

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      var nombre = (data.get('nombre') || '').toString().trim();
      var empresa = (data.get('empresa') || '').toString().trim();
      var telefono = (data.get('telefono') || '').toString().trim();
      var correo = (data.get('correo') || '').toString().trim();
      var solucion = (data.get('solucion') || '').toString();
      var mensaje = (data.get('mensaje') || '').toString().trim();
      var canal = (data.get('canal') || 'whatsapp').toString();
      var privacidad = contactForm.querySelector('#privacidad').checked;

      var valid = true;
      var firstInvalid = null;
      var mark = function (id, message) {
        setError(id, message);
        if (message) {
          valid = false;
          if (!firstInvalid) firstInvalid = document.getElementById(id);
        }
      };

      mark('nombre', nombre ? '' : 'Escribe tu nombre.');
      mark('mensaje', mensaje ? '' : 'Cuéntanos brevemente qué necesitas.');
      mark('telefono', canal === 'whatsapp' && !telefono ? 'Para responderte por WhatsApp necesitamos tu teléfono.' : '');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (canal === 'correo' && !correo) {
        mark('correo', 'Para responderte por correo necesitamos tu dirección.');
      } else if (correo && !emailOk) {
        mark('correo', 'Revisa el formato del correo.');
      } else {
        mark('correo', '');
      }
      mark('privacidad', privacidad ? '' : 'Debes aceptar el aviso de privacidad.');

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var body = 'Nombre: ' + nombre + '\n' +
        (empresa ? 'Empresa: ' + empresa + '\n' : '') +
        (telefono ? 'Teléfono: ' + telefono + '\n' : '') +
        (correo ? 'Correo: ' + correo + '\n' : '') +
        'Solución de interés: ' + solucion + '\n\n' +
        'Mensaje:\n' + mensaje;

      if (canal === 'whatsapp') {
        var texto = 'Hola, he visto la web de SIDGI y me gustaría recibir información.\n\n' + body;
        window.open('https://wa.me/34623627923?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      } else {
        var subject = 'Solicitud de información — ' + (empresa || nombre);
        window.location.href = 'mailto:sidgifichajes@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      }
    });
  }
});
