// =====================================
// CONFIGURACIÓN GENERAL
// =====================================
const ADMIN_EMAIL = "veralautharo@gmail.com";
const LS_USERS = "tb_users";
const LS_WORKS = "tb_works_v1";

// Helpers
const IN_PAGES = location.pathname.includes("/pages/");
const IMG = (n) => IN_PAGES ? `../img/${n}` : `img/${n}`;

// =====================================
// USUARIOS
// =====================================
function getUsers() {
  return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
}

function setUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("usuario_activo") || "null");
}

function setCurrentUser(user) {
  localStorage.setItem("usuario_activo", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("usuario_activo");
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// =====================================
// LOGIN / REGISTRO
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const pass = document.getElementById("login-password").value.trim();

      const users = getUsers();
      const user = users.find((u) => u.email === email && u.pass === pass);

      if (!user) {
        alert("❌ Credenciales incorrectas");
        return;
      }

      setCurrentUser(user);
      alert(`Bienvenido ${user.name || "usuario"} 👋`);
      location.href = "trabajos.html";
    });
  }

  // REGISTRO
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const pass = document.getElementById("register-password").value.trim();

      if (!name || !email || !pass) {
        alert("Por favor completá todos los campos");
        return;
      }

      const users = getUsers();
      if (users.find((u) => u.email === email)) {
        alert("Ese correo ya está registrado.");
        return;
      }

      users.push({ name, email, pass });
      setUsers(users);
      alert("✅ Cuenta creada con éxito. Ahora iniciá sesión.");
      location.href = "login.html";
    });
  }
});

// =====================================
// LOGOUT
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearCurrentUser();
      alert("Sesión cerrada 👋");
      location.href = "../index.html";
    });
  }
});

// =====================================
// NAVEGACIÓN SUPERIOR
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("nav-login");
  const perfilLink = document.getElementById("nav-perfil");
  const user = getCurrentUser();

  if (loginLink && perfilLink) {
    if (user) {
      loginLink.style.display = "none";
      perfilLink.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      perfilLink.style.display = "none";
    }
  }
});

// =====================================
// TRABAJOS — CRUD
// =====================================
function getWorks() {
  return JSON.parse(localStorage.getItem(LS_WORKS) || "[]");
}

function setWorks(works) {
  localStorage.setItem(LS_WORKS, JSON.stringify(works));
}

// Renderizar tabla
function renderTrabajos() {
  const tbody = document.getElementById("tbody-works");
  if (!tbody) return;

  const works = getWorks();
  const admin = isAdmin();

  tbody.innerHTML = works.map((w, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${w.titulo}</td>
      <td>${w.tipo}</td>
      <td>${w.fecha}</td>
      <td>${w.descripcion}</td>
      <td><img src="${w.img}" alt="img" style="width:64px;height:48px;border-radius:8px;"></td>
      <td>${w.reel ? `<a href="${w.reel}" target="_blank" class="btn">Ver</a>` : "-"}</td>
      ${admin ? `
        <td>
          <button class="btn btn-primary" onclick="editarTrabajo(${i})">Editar</button>
          <button class="btn" onclick="eliminarTrabajo(${i})">Eliminar</button>
        </td>` : ""}
    </tr>
  `).join("");
}

// Agregar un trabajo (solo admin)
function agregarTrabajo(titulo, tipo, fecha, descripcion, img, reel) {
  const works = getWorks();
  works.push({ titulo, tipo, fecha, descripcion, img, reel });
  setWorks(works);
  renderTrabajos();
}

// Eliminar trabajo
function eliminarTrabajo(index) {
  if (!isAdmin()) return alert("Solo el admin puede eliminar trabajos");
  if (confirm("¿Eliminar este trabajo?")) {
    const works = getWorks();
    works.splice(index, 1);
    setWorks(works);
    renderTrabajos();
  }
}

// Editar trabajo
function editarTrabajo(index) {
  if (!isAdmin()) return alert("Solo el admin puede editar trabajos");

  const works = getWorks();
  const t = works[index];
  const nuevoTitulo = prompt("Nuevo título:", t.titulo);
  const nuevaDesc = prompt("Nueva descripción:", t.descripcion);

  if (nuevoTitulo && nuevaDesc) {
    t.titulo = nuevoTitulo;
    t.descripcion = nuevaDesc;
    setWorks(works);
    renderTrabajos();
  }
}

document.addEventListener("DOMContentLoaded", renderTrabajos);

// =====================================
// DATOS INICIALES (para test)
if (!localStorage.getItem(LS_WORKS)) {
  setWorks([
    {
      titulo: "Cambio de pantalla Touch Notebook ACER",
      tipo: "Reparación",
      fecha: "05/10/2025",
      descripcion: "Se procedió al cambio de flex y pantalla touch de notebook Acer - Model: KGJJK156",
      img: IMG("notebook.jpeg"),
      reel: ""
    },
    {
      titulo: "Limpieza + pasta térmica",
      tipo: "Mantenimiento",
      fecha: "31/01/2025",
      descripcion: "Limpieza interna, cambio de pasta y revisión general.",
      img: IMG("mantenimineto_ref_cooler_master7.jpg"),
      reel: ""
    }
  ]);
}
