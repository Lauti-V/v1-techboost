// ==========================
// VARIABLES BASE
// ==========================
const ADMIN_EMAIL = "veralautharo@gmail.com";
const IN_PAGES = location.pathname.includes("/pages/");
const IMG = (n)=> IN_PAGES ? `../img/${n}` : `img/${n}`;
const getUser = ()=> localStorage.getItem("usuario") || "";
const setUser = (e)=> localStorage.setItem("usuario", e);
const clearUser = ()=> localStorage.removeItem("usuario");
const isAdmin = ()=> getUser().toLowerCase() === ADMIN_EMAIL.toLowerCase();

// ==========================
// NAVEGACIÓN Y LOGIN
// ==========================
function actualizarNavegacion(){
  const login = document.getElementById("nav-login");
  const perfil = document.getElementById("nav-perfil");
  if (!login || !perfil) return;
  const hasUser = !!getUser();
  login.style.display  = hasUser ? "none" : "inline-block";
  perfil.style.display = hasUser ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", actualizarNavegacion);

// ==========================
// LOGIN SIMPLE
// ==========================
document.addEventListener("DOMContentLoaded", ()=>{
  const btn = document.getElementById("login-btn");
  if(btn){
    btn.addEventListener("click", ()=>{
      const email = document.getElementById("login-email").value.trim();
      if(!email) return alert("Ingresá tu email");
      setUser(email);
      location.href = "trabajos.html";
    });
  }
});

// ==========================
// TRABAJOS (CRUD SIMPLE)
// ==========================
const LS_WORKS = "tb_works_v1";
const getWorks = ()=> JSON.parse(localStorage.getItem(LS_WORKS)||"[]");
const setWorks = (arr)=> localStorage.setItem(LS_WORKS, JSON.stringify(arr));

function renderTrabajos(){
  const tbody = document.getElementById("tbody-works");
  if(!tbody) return;
  const admin = isAdmin();
  const arr = getWorks();
  tbody.innerHTML = arr.map((w,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${w.titulo}</td>
      <td>${w.tipo}</td>
      <td>${w.fecha}</td>
      <td>${w.descripcion}</td>
      <td><img src="${w.img}" style="width:64px;height:48px;border-radius:8px"></td>
      <td>${w.reel ? `<a class='btn' href='${w.reel}' target='_blank'>Ver</a>`:"-"}</td>
      ${admin ? `<td><button class='btn' data-del='${w.id}'>Eliminar</button></td>` : ""}
    </tr>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderTrabajos);
