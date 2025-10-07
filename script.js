/********************
 * Utilidades
 ********************/
const qs  = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

/********************
 * Datos base: Recursos (usados por tabla/cards/ficha)
 * Importante: como se renderiza desde /pages/, las imágenes van con ../img/
 ********************/
const recursos = [
  {
    id: 1,
    titulo: "Claves para Windows 10/11",
    categoria: "Claves",
    nivel: "Inicial",
    img: "../img/windows_llave.jpg",
    resumen: "Pasos simples para mejorar rendimiento, limpieza temporal y arranque.",
  },
  {
    id: 2,
    titulo: "Cuidados esenciales para tu notebook",
    categoria: "Hardware",
    nivel: "Inicial",
    img: "../img/notebook.jpg",
    resumen: "Consejos prácticos para prolongar la vida útil de tu notebook.",
  },
  {
    id: 3,
    titulo: "Optimización básica de Windows 11",
    categoria: "Optimización",
    nivel: "Intermedio",
    img: "../img/windows_opt.jpg",
    resumen: "Servicios, inicio, desbloat, drivers y ajustes visuales.",
  },
  {
    id: 4,
    titulo: "Instalar paquete de Office",
    categoria: "Software",
    nivel: "Inicial",
    img: "../img/office_instalar.jpg",
    resumen: "Guía para descargar, instalar y activar Microsoft Office correctamente.",
  }
];


/********************
 * Autenticación (localStorage)
 ********************/
const LS_USERS_KEY   = "users";
const LS_SESSION_KEY = "session";

const getUsers    = () => JSON.parse(localStorage.getItem(LS_USERS_KEY) || "[]");
const setUsers    = (a) => localStorage.setItem(LS_USERS_KEY, JSON.stringify(a));
const getSession  = () => JSON.parse(localStorage.getItem(LS_SESSION_KEY) || "null");
const setSession  = (s) => localStorage.setItem(LS_SESSION_KEY, JSON.stringify(s));
const clearSession= () => localStorage.removeItem(LS_SESSION_KEY);

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return String(h);
}

function paintNavAuth() {
  const s = getSession();
  const navLogin = qs("#nav-login");
  const navPerfil = qs("#nav-perfil");
  if (!navLogin || !navPerfil) return;
  if (s) { navLogin.style.display = "none"; navPerfil.style.display = "inline-block"; }
  else   { navLogin.style.display = "inline-block"; navPerfil.style.display = "none"; }
}

/********************
 * Listados (tabla/cards) y ficha
 ********************/
function renderTabla() {
  const tbody = qs("#tbody-recursos");
  if (!tbody) return;
  tbody.innerHTML = recursos.map((r, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${r.titulo}</td>
      <td><span class="badge">${r.categoria}</span></td>
      <td>${r.nivel}</td>
      <td><a class="btn" href="producto.html?id=${r.id}">Ver</a></td>
    </tr>
  `).join("");
}

function renderGrid() {
  const g = qs("#grid-recursos");
  if (!g) return;
  g.innerHTML = recursos.map(r => `
    <article class="card">
      <img src="${r.img}" alt="${r.titulo}">
      <div class="pad">
        <h3>${r.titulo}</h3>
        <p class="muted">${r.categoria} · ${r.nivel}</p>
        <p>${r.resumen}</p>
        <a class="btn" href="producto.html?id=${r.id}">Leer más</a>
      </div>
    </article>
  `).join("");
}

function renderFicha() {
  const box = qs("#ficha");
  if (!box) return;
  const id = new URLSearchParams(location.search).get("id");
  const r = recursos.find(x => String(x.id) === String(id));
  if (!r) { box.innerHTML = "<p>No se encontró el recurso.</p>"; return; }

  box.innerHTML = `
    <img src="${r.img}" alt="${r.titulo}">
    <div>
      <h1>${r.titulo}</h1>
      <p class="muted">${r.categoria} · ${r.nivel}</p>
      <p>${r.resumen}</p>
      <h3>Pasos</h3>
      <div class="specs">
        ${r.pasos.map(p => `<div class="feature">${p}</div>`).join("")}
      </div>
      ${r.enlaces?.length ? `
        <h3 style="margin-top:16px">Enlaces</h3>
        <ul>${r.enlaces.map(e => `<li><a class="btn" href="${e.href}" target="_blank" rel="noopener">${e.t}</a></li>`).join("")}</ul>
      ` : ""}
    </div>
  `;
}

/********************
 * Contacto (form simple)
 ********************/
function renderCarrito() {
  // Nota: el formulario fue simplificado; no hay "carrito".
  // Mantenemos el mensaje de éxito.
  const form = qs("#form-contacto");
  const msg  = qs("#msg");
  if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    msg?.removeAttribute("hidden");
    form.reset();
  });
}

/********************
 * Registro / Login
 ********************/
function bindRegister() {
  const f = qs("#form-register");
  if (!f) return;
  f.addEventListener("submit", (e)=>{
    e.preventDefault();
    const nombre = f.nombre.value.trim();
    const email  = f.email.value.trim().toLowerCase();
    const pass   = f.pass.value;
    const users  = getUsers();
    if (users.some(u => u.email === email)) { alert("Ese email ya existe."); return; }
    users.push({ nombre, email, passHash: hash(pass) });
    setUsers(users);
    setSession({ email, nombre });
    location.href = "perfil.html";
  });
}

function bindLogin() {
  const f = qs("#form-login");
  if (!f) return;
  f.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = f.email.value.trim().toLowerCase();
    const pass  = f.pass.value;
    const u = getUsers().find(x => x.email === email && x.passHash === hash(pass));
    if (!u) { alert("Credenciales inválidas"); return; }
    setSession({ email, nombre: u.nombre });
    location.href = "perfil.html";
  });
}

/********************
 * Perfil: mantenimientos del usuario
 ********************/
function requireAuth() {
  const s = getSession();
  if (!s) location.href = "login.html";
}

const addMonths = (date, m) => { const d = new Date(date); d.setMonth(d.getMonth() + Number(m)); return d; };
const fmt       = (d) => new Date(d).toLocaleDateString("es-AR");
const keyMaint  = (email) => `maints_${email}`;
const getMaints = (email) => JSON.parse(localStorage.getItem(keyMaint(email)) || "[]");
const setMaints = (email, arr) => localStorage.setItem(keyMaint(email), JSON.stringify(arr));

function bindPerfil() {
  const s = getSession(); if (!s) return;
  const w = qs("#bienvenida");
  if (w) w.textContent = `Hola ${s.nombre}, acá podés registrar y ver tus mantenimientos.`;

  const tbody = qs("#tbody-maint");
  function renderTable() {
    const rows = getMaints(s.email).map((m, i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${m.equipo}</td>
        <td>${m.tipo}</td>
        <td>${fmt(m.fechaISO)}</td>
        <td>${m.periodoMeses} m</td>
        <td>${fmt(m.proximaISO)}</td>
        <td>${m.notas || ""}</td>
      </tr>
    `).join("");
    tbody.innerHTML = rows || `<tr><td colspan="7" class="muted">Sin registros aún.</td></tr>`;
  }
  renderTable();

  qs("#form-maint")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const equipo   = fd.get("equipo");
    const tipo     = fd.get("tipo");
    const fecha    = fd.get("fecha");
    const periodo  = Number(fd.get("periodo"));
    const notas    = fd.get("notas");
    const proxima  = addMonths(fecha, periodo);
    const arr = getMaints(s.email);
    arr.push({
      id: Date.now(),
      equipo, tipo,
      fechaISO: new Date(fecha).toISOString(),
      periodoMeses: periodo,
      proximaISO: proxima.toISOString(),
      notas
    });
    setMaints(s.email, arr);
    e.currentTarget.reset();
    renderTable();
    alert("Mantenimiento guardado ✔");
  });

  qs("#btn-logout")?.addEventListener("click", ()=>{
    clearSession();
    location.href = "../index.html";
  });
}

/********************
 * Trabajos (público + admin)
 ********************/
const OWNER_EMAIL = "veralautharo@gmail.com";
const isOwner = () => {
  const s = getSession();
  return s && (s.email || "").toLowerCase() === OWNER_EMAIL.toLowerCase();
};

const LS_WORKS_KEY = "works";
const getWorks = () => JSON.parse(localStorage.getItem(LS_WORKS_KEY) || "[]");
const setWorks = (a) => localStorage.setItem(LS_WORKS_KEY, JSON.stringify(a));
const fmtDate  = (d) => { try { return new Date(d).toLocaleDateString("es-AR"); } catch { return d || "-"; } };

function seedWorksIfEmpty() {
  try {
    const cur = getWorks();
    if (Array.isArray(cur) && cur.length === 0) {
      setWorks([
  {
    id: 101,
    titulo: "Cambio de pantalla Touch Notebook ACER",
    tipo: "Reparación",
    fecha: "2025-10-05",
    descripcion: "Se procedió a cambiar el flex y pantalla touch de una notebook Acer.",
    img: "../img/trabajo1.jpg",
    reel: ""
  },
  {
    id: 102,
    titulo: "Limpieza + pasta térmica",
    tipo: "Mantenimiento",
    fecha: "2025-01-31",
    descripcion: "Limpieza interna, cambio de pasta y revisión general.",
    img: "../img/trabajo2.jpg",
    reel: ""
  }
]);

    }
  } catch (e) { console.warn(e); }
}

function renderWorksPublic() {
  const thead = qs("#thead-works");
  const tbody = qs("#tbody-works");
  const grid  = qs("#grid-works");
  const owner = isOwner();

  const works = getWorks().slice().sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""));

  if (thead) {
    thead.innerHTML = `
      <tr>
        <th>#</th>
        <th>Título</th>
        <th>Tipo</th>
        <th>Fecha</th>
        <th>Descripción</th>
        <th>Imagen</th>
        <th>Reel</th>
        ${owner ? "<th>Acciones</th>" : ""}
      </tr>
    `;
  }

  if (tbody) {
    tbody.innerHTML =
      works.map((w,i)=>`
        <tr>
          <td>${i+1}</td>
          <td>${w.titulo || "-"}</td>
          <td><span class="badge">${w.tipo || ""}</span></td>
          <td>${w.fecha ? fmtDate(w.fecha) : "-"}</td>
          <td>${w.descripcion || "-"}</td>
          <td>${w.img ? `<img src="${w.img}" alt="${w.titulo}" style="width:80px;height:60px;object-fit:cover;border-radius:6px">` : "-"}</td>
          <td>${w.reel ? `<a class="btn" href="${w.reel}" target="_blank" rel="noopener">Ver</a>` : "-"}</td>
          ${owner ? `
          <td>
            <button class="btn" onclick="editWork(${w.id})">Editar</button>
            <button class="btn" onclick="deleteWork(${w.id})">Eliminar</button>
          </td>` : ""}
        </tr>
      `).join("") || `<tr><td colspan="${owner?8:7}" class="muted">Aún no hay trabajos cargados.</td></tr>`;
  }

  if (grid) {
    grid.innerHTML =
      works.map(w => `
        <article class="card">
          ${w.img ? `<img src="${w.img}" alt="${w.titulo}">` : ""}
          <div class="pad">
            <h3>${w.titulo}</h3>
            <p class="muted">${w.tipo || ""} ${w.fecha ? "· "+fmtDate(w.fecha) : ""}</p>
            ${w.descripcion ? `<p>${w.descripcion}</p>` : ""}
            ${w.reel ? `<p><a class="btn" href="${w.reel}" target="_blank" rel="noopener">Ver reel</a></p>` : ""}
          </div>
        </article>
      `).join("") || `<p class="muted">Aún no hay trabajos cargados.</p>`;
  }
}

let editingWorkId = null;

function bindWorksAdmin() {
  const box      = qs("#admin-box");
  const form     = qs("#form-work");
  const btnCancel= qs("#btn-cancel");
  const title    = qs("#admin-title");

  if (!box || !form) return;

  if (!isOwner()) { box.style.display = "none"; return; }
  box.style.display = "block";

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      id: editingWorkId || Date.now(),
      titulo: (fd.get("titulo") || "").trim(),
      tipo: (fd.get("tipo") || "").trim(),
      fecha: fd.get("fecha") || "",
      descripcion: (fd.get("descripcion") || "").trim(),
      img: (fd.get("img") || "").trim(),
      reel: (fd.get("reel") || "").trim()
    };

    if (!data.titulo || !data.tipo || !data.fecha) {
      alert("Completá título, tipo y fecha.");
      return;
    }

    const arr = getWorks();
    const ix  = arr.findIndex(x => String(x.id) === String(data.id));

    if (editingWorkId && ix >= 0) arr[ix] = data; // editar
    else arr.push(data); // agregar

    setWorks(arr);
    renderWorksPublic();
    form.reset();
    editingWorkId = null;
    if (title) title.textContent = "Agregar trabajo";
    if (btnCancel) btnCancel.style.display = "none";
    alert("Guardado ✔");
  });

  btnCancel?.addEventListener("click", ()=>{
    form.reset();
    editingWorkId = null;
    if (title) title.textContent = "Agregar trabajo";
    if (btnCancel) btnCancel.style.display = "none";
  });
}

// Expuestas para usar en los botones inline de la tabla
window.editWork = function(id){
  if (!isOwner()) return;
  const w = getWorks().find(x => String(x.id) === String(id));
  if (!w) return alert("No se encontró el trabajo.");
  const form = qs("#form-work");
  const title = qs("#admin-title");
  const btnCancel = qs("#btn-cancel");
  if (!form) return;

  form.id.value          = w.id;
  form.titulo.value      = w.titulo || "";
  form.tipo.value        = w.tipo || "";
  form.fecha.value       = w.fecha || "";
  form.descripcion.value = w.descripcion || "";
  form.img.value         = w.img || "";
  form.reel.value        = w.reel || "";

  editingWorkId = w.id;
  if (title) title.textContent = "Editar trabajo";
  if (btnCancel) btnCancel.style.display = "inline-block";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
};

window.deleteWork = function(id){
  if (!isOwner()) return;
  if (!confirm("¿Eliminar este trabajo?")) return;
  const arr = getWorks().filter(x => String(x.id) !== String(id));
  setWorks(arr);
  renderWorksPublic();
};

/********************
 * INIT por página
 ********************/
window.addEventListener("DOMContentLoaded", () => {
  paintNavAuth();

  // Si querés “semilla” de trabajos en localStorage:
  seedWorksIfEmpty();

  // Páginas bajo /pages/
  if (location.pathname.endsWith("listado_tabla.html"))  renderTabla();
  if (location.pathname.endsWith("listado_box.html"))    renderGrid();
  if (location.pathname.endsWith("producto.html"))       renderFicha();
  if (location.pathname.endsWith("comprar.html"))        renderCarrito();
  if (location.pathname.endsWith("register.html"))       bindRegister();
  if (location.pathname.endsWith("login.html"))          bindLogin();
  if (location.pathname.endsWith("perfil.html"))         { requireAuth(); bindPerfil(); }
  if (location.pathname.endsWith("trabajos.html"))       { renderWorksPublic(); bindWorksAdmin(); }
});
