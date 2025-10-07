/* ===== Config ===== */
const ADMIN_EMAIL = "veralautharo@gmail.com";
const LS_USERS = "tb_users_v1";
const LS_WORKS = "tb_works_v1";
const IN_PAGES = location.pathname.includes("/pages/");
const IMG = (n)=> IN_PAGES ? `../img/${n}` : `img/${n}`;

/* ===== Session helpers ===== */
const getUsers = ()=> JSON.parse(localStorage.getItem(LS_USERS)||"[]");
const setUsers = (u)=> localStorage.setItem(LS_USERS, JSON.stringify(u));
const getUser = ()=> JSON.parse(localStorage.getItem("usuario_activo")||"null");
const setUser = (u)=> localStorage.setItem("usuario_activo", JSON.stringify(u));
const clearUser = ()=> localStorage.removeItem("usuario_activo");
const isAdmin = ()=> (getUser()?.email||"").toLowerCase() === ADMIN_EMAIL.toLowerCase();

/* ===== Navbar show/hide ===== */
function actualizarNavegacion(){
  const login = document.getElementById("nav-login");
  const perfil = document.getElementById("nav-perfil");
  if(!login || !perfil) return;
  const hasUser = !!getUser();
  login.style.display  = hasUser ? "none" : "inline-block";
  perfil.style.display = hasUser ? "inline-block" : "none";
}

/* ===== Auth: login/register/logout ===== */
function bindAuth(){
  // login
  const loginForm = document.getElementById("login-form");
  if(loginForm){
    loginForm.addEventListener("submit", e=>{
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim().toLowerCase();
      const pass  = document.getElementById("login-password").value.trim();
      const u = getUsers().find(x=> x.email===email && x.pass===pass);
      if(!u){ alert("Credenciales inválidas"); return; }
      setUser(u);
      location.href = "trabajos.html";
    });
  }
  // register
  const regForm = document.getElementById("register-form");
  if(regForm){
    regForm.addEventListener("submit", e=>{
      e.preventDefault();
      const name = document.getElementById("register-name").value.trim();
      const email= document.getElementById("register-email").value.trim().toLowerCase();
      const pass = document.getElementById("register-password").value.trim();
      if(!name || !email || !pass){ alert("Completá todos los campos"); return; }
      const users = getUsers();
      if(users.some(u=>u.email===email)){ alert("Ese email ya existe"); return; }
      users.push({name,email,pass});
      setUsers(users);
      alert("✅ Cuenta creada, ahora iniciá sesión");
      location.href = "login.html";
    });
  }
  // logout
  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn){
    logoutBtn.addEventListener("click", ()=>{
      clearUser();
      location.href = "../index.html";
    });
  }
}

/* ===== Catálogo (grid) + Ficha ===== */
const recursos = [
  { id:1, titulo:"Claves para Windows 10/11", categoria:"Claves", nivel:"Inicial",
    img:IMG("windows_llave.jpg"),
    resumen:"Pasos simples para limpiar temporales, desactivar apps en inicio y actualizar drivers.",
    pasos:["Desinstalar bloatware","Limpiar %temp%","Desactivar apps en segundo plano","Drivers al día","Revisar TRIM/SMART"] },
  { id:2, titulo:"Cuidados esenciales para tu notebook", categoria:"Hardware", nivel:"Inicial",
    img:IMG("notebook.jpeg"),
    resumen:"Buenas prácticas de uso y mantenimiento para alargar la vida del equipo.",
    pasos:["Base refrigerante","No tapar ventilaciones","Limpieza de polvo","Cuidado de batería"] },
  { id:3, titulo:"Optimización básica de Windows 11", categoria:"Optimización", nivel:"Intermedio",
    img:IMG("windows_opt.jpg"),
    resumen:"Servicios, inicio, desbloat y ajustes visuales para rendimiento.",
    pasos:["Deshabilitar inicio","Servicios innecesarios","Desbloat con cuidado","Actualizar drivers","Punto de restauración"] },
  { id:4, titulo:"Instalar paquete de Office", categoria:"Software", nivel:"Inicial",
    img:IMG("office_instalar.jpg"),
    resumen:"Descarga, instalación y activación correcta de MS Office.",
    pasos:["Descargar instalador","Instalar edición","Activación segura","Verificar licencia"] },
];

function renderRecursosGrid(){
  const grid = document.getElementById("grid-recursos");
  if(!grid) return;
  grid.innerHTML = recursos.map(r=>`
    <article class="card">
      <img src="${r.img}" alt="${r.titulo}" onerror="this.src='${IMG("windows_llave.jpg")}'">
      <div class="pad">
        <h3>${r.titulo}</h3>
        <p class="muted">${r.categoria} · ${r.nivel}</p>
        <p>${r.resumen}</p>
        <a href="producto.html?id=${r.id}" class="btn">Leer más</a>
      </div>
    </article>
  `).join("");
}

function renderProducto(){
  const cont = document.getElementById("ficha");
  if(!cont) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  const item = recursos.find(r=>r.id===id);
  if(!item){ cont.innerHTML = "<p>No se encontró el recurso.</p>"; return; }
  cont.innerHTML = `
    <img src="${item.img}" alt="${item.titulo}" onerror="this.src='${IMG("windows_llave.jpg")}'">
    <div>
      <h2>${item.titulo}</h2>
      <p><strong>Categoría:</strong> ${item.categoria}</p>
      <p><strong>Nivel:</strong> ${item.nivel}</p>
      <p>${item.resumen}</p>
      <h3>Pasos</h3>
      <ul>${item.pasos.map(p=>`<li>${p}</li>`).join("")}</ul>
      <a href="listado_box.html" class="btn">Volver</a>
    </div>`;
}

/* ===== Trabajos (única tabla) ===== */
const getWorks = ()=> JSON.parse(localStorage.getItem(LS_WORKS)||"[]");
const setWorks = (arr)=> localStorage.setItem(LS_WORKS, JSON.stringify(arr));

function seedWorksIfEmpty(){
  if(getWorks().length) return;
  setWorks([
    { id:Date.now(),     titulo:"Cambio de pantalla touch Notebook ACER", tipo:"Reparación",   fecha:"2025-10-05", descripcion:"Cambio de flex y pantalla touch.", img:IMG("trabajo1.jpg"), reel:"" },
    { id:Date.now() + 1, titulo:"Limpieza + pasta térmica",               tipo:"Mantenimiento", fecha:"2025-01-31", descripcion:"Limpieza interna, cambio de pasta y revisión general.", img:IMG("trabajo2.jpg"), reel:"" },
  ]);
}

function formatDate(iso){
  if(!iso) return "-";
  const d=new Date(iso);
  if(isNaN(d)) return iso; // por si cargás dd/mm/yyyy
  return d.toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"});
}

function fillWorkForm(w={}){
  const q=id=>document.getElementById(id);
  if(!q("w-title")) return;
  q("w-id").value    = w.id||"";
  q("w-title").value = w.titulo||"";
  q("w-type").value  = w.tipo||"Reparación";
  q("w-date").value  = (w.fecha && /^\d{4}-\d{2}-\d{2}$/.test(w.fecha)) ? w.fecha : "";
  q("w-desc").value  = w.descripcion||"";
  q("w-img").value   = w.img||IMG("trabajo1.jpg");
  q("w-reel").value  = w.reel||"";
}

function renderTrabajos(){
  const tbody = document.getElementById("tbody-works");
  if(!tbody) return;

  const admin = isAdmin();
  const thAcc = document.getElementById("th-acciones");
  if(thAcc) thAcc.style.display = admin ? "" : "none";

  const arr = getWorks().sort((a,b)=> (a.fecha||"") < (b.fecha||"") ? 1 : -1);
  tbody.innerHTML = arr.map((w,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${w.titulo}</td>
      <td><span class="badge">${w.tipo}</span></td>
      <td>${formatDate(w.fecha)}</td>
      <td>${w.descripcion}</td>
      <td>${w.img ? `<img src="${w.img}" style="width:64px;height:48px;object-fit:cover;border-radius:6px">`:"-"}</td>
      <td>${w.reel ? `<a class="btn" target="_blank" href="${w.reel}">Ver</a>`:"-"}</td>
      <td ${admin?"":"style='display:none'"} >
        <a class="btn" data-edit="${w.id}">Editar</a>
        <a class="btn" data-del="${w.id}">Eliminar</a>
      </td>
    </tr>
  `).join("");

  if(admin){
    tbody.querySelectorAll("[data-edit]").forEach(a=>{
      a.addEventListener("click", ()=>{
        const id=a.getAttribute("data-edit");
        const w=getWorks().find(x=>String(x.id)===String(id));
        fillWorkForm(w); scrollTo({top:0,behavior:"smooth"});
      });
    });
    tbody.querySelectorAll("[data-del]").forEach(a=>{
      a.addEventListener("click", ()=>{
        const id=a.getAttribute("data-del");
        if(!confirm("¿Eliminar este trabajo?")) return;
        setWorks(getWorks().filter(x=>String(x.id)!==String(id)));
        renderTrabajos();
      });
    });
  }
}

function bindAdminUI(){
  const adminBox = document.getElementById("admin-box");
  if(adminBox) adminBox.style.display = isAdmin() ? "" : "none";

  const clear = document.getElementById("w-clear");
  const save  = document.getElementById("w-save");
  clear && clear.addEventListener("click", e=>{e.preventDefault(); fillWorkForm({});});
  save  && save.addEventListener("click", e=>{
    e.preventDefault();
    const q=id=>document.getElementById(id);
    const id=q("w-id").value.trim();
    const wNew={
      id: id || Date.now(),
      titulo:(q("w-title").value||"").trim(),
      tipo:q("w-type").value,
      fecha:q("w-date").value || "", // dejamos libre formato
      descripcion:(q("w-desc").value||"").trim(),
      img:(q("w-img").value||"").trim(),
      reel:(q("w-reel").value||"").trim()
    };
    if(!wNew.titulo){ alert("Completá el Título"); return; }
    const arr=getWorks();
    const i=arr.findIndex(x=>String(x.id)===String(id));
    if(i>=0) arr[i]=wNew; else arr.push(wNew);
    setWorks(arr);
    fillWorkForm({}); renderTrabajos();
  });
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", ()=>{
  actualizarNavegacion();
  bindAuth();

  // catálogo / ficha
  renderRecursosGrid();
  renderProducto();

  // trabajos (tabla única)
  if(document.getElementById("tbody-works")){
    seedWorksIfEmpty();
    bindAdminUI();
    renderTrabajos();
  }
});
