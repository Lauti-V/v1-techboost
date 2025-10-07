/* ========= CONFIG ========= */
const ADMIN_EMAIL = "veralautharo@gmail.com";
const IN_PAGES = location.pathname.includes("/pages/");
const IMG = (n) => (IN_PAGES ? `../img/${n}` : `img/${n}`);

const getUser = () => localStorage.getItem("usuario") || "";
const setUser = (email) => localStorage.setItem("usuario", email);
const clearUser = () => localStorage.removeItem("usuario");
const isAdmin = () => getUser().toLowerCase() === ADMIN_EMAIL.toLowerCase();

/* ========= NAV/LOGIN ========= */
function actualizarNavegacion(){
  const login = document.getElementById("nav-login");
  const perfil = document.getElementById("nav-perfil");
  if (login && perfil){
    if (getUser()){ login.style.display="inline-block"; perfil.style.display="inline-block"; }
    login.style.display = getUser() ? "none" : "inline-block";
    perfil.style.display = getUser() ? "inline-block" : "none";
  }
}

function bindLoginPage(){
  const btn = document.getElementById("login-btn");
  if (!btn) return;
  btn.addEventListener("click", ()=>{
    const email = (document.getElementById("login-email").value||"").trim();
    if(!email) return alert("Ingresá un email");
    setUser(email);
    location.href = isAdmin() ? "trabajos.html" : "../index.html";
  });
}

function bindLogout(){
  const out = document.getElementById("logout");
  if (!out) return;
  out.addEventListener("click", ()=>{
    clearUser();
    location.href = IN_PAGES ? "../index.html" : "index.html";
  });
}

/* ========= RECURSOS (Catálogo/Tabla/Ficha) ========= */
const recursos = [
  {
    id:1,
    titulo:"Claves para Windows 10/11",
    categoria:"Claves",
    nivel:"Inicial",
    img:IMG("windows_llave.jpg"),
    resumen:"Pasos simples para mejorar rendimiento, limpieza temporal y arranque.",
    pasos:[
      "Desinstalar bloatware innecesario.",
      "Limpiar temporales (Win+R → %temp%).",
      "Desactivar apps en segundo plano innecesarias.",
      "Actualizar drivers y Windows Update.",
      "Comprobar estado del disco (TRIM/SMART).",
    ],
  },
  {
    id:2,
    titulo:"Cuidados esenciales para tu notebook",
    categoria:"Hardware",
    nivel:"Inicial",
    img:IMG("notebook.jpeg"),
    resumen:"Consejos prácticos para prolongar la vida útil de tu notebook.",
    pasos:["Base refrigerante","No tapar ventilaciones","Limpieza de polvo","Cuidado de batería"],
  },
  {
    id:3,
    titulo:"Optimización básica de Windows 11",
    categoria:"Optimización",
    nivel:"Intermedio",
    img:IMG("windows_opt.jpg"),
    resumen:"Servicios, inicio, desbloat, drivers y ajustes visuales.",
    pasos:["Deshabilitar inicio","Servicios innecesarios","Desbloat con precaución","Actualizar drivers","Punto de restauración"],
  },
  {
    id:4,
    titulo:"Instalar paquete de Office",
    categoria:"Software",
    nivel:"Inicial",
    img:IMG("office_instalar.jpg"),
    resumen:"Descargar, instalar y activar Microsoft Office correctamente.",
    pasos:["Descargar instalador","Instalar edición","Activación segura","Verificar licencia"],
  },
];

function renderRecursos(){
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

function renderTablaRecursos(){
  const tbody = document.getElementById("tbody-recursos");
  if(!tbody) return;
  tbody.innerHTML = recursos.map((r,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${r.titulo}</td>
      <td>${r.categoria}</td>
      <td>${r.nivel}</td>
      <td><a class="btn" href="producto.html?id=${r.id}">Ver</a></td>
    </tr>
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

/* ========= TRABAJOS (CRUD LocalStorage) ========= */
const LS_WORKS = "tb_works_v1";
const getWorks = ()=>{ try{ return JSON.parse(localStorage.getItem(LS_WORKS))||[] }catch{return []} };
const setWorks = (arr)=>localStorage.setItem(LS_WORKS,JSON.stringify(arr));
function seedWorksIfEmpty(){
  if(getWorks().length) return;
  setWorks([
    { id:Date.now(), titulo:"Cambio de pantalla touch Notebook ACER", tipo:"Reparación", fecha:"2025-10-05", descripcion:"Cambio de flex y pantalla touch.", img:IMG("trabajo1.jpg"), reel:"" },
    { id:Date.now()+1, titulo:"Limpieza + pasta térmica", tipo:"Mantenimiento", fecha:"2025-01-31", descripcion:"Limpieza interna, cambio de pasta y revisión general.", img:IMG("trabajo2.jpg"), reel:"" },
  ]);
}
const formatDate = (iso)=>{ if(!iso) return "-"; const d=new Date(iso); return d.toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}) };

function fillWorkForm(w={}){
  const q=id=>document.getElementById(id);
  q("w-id").value = w.id||"";
  q("w-title").value = w.titulo||"";
  q("w-type").value = w.tipo||"Reparación";
  q("w-date").value = w.fecha||"";
  q("w-desc").value = w.descripcion||"";
  q("w-img").value = w.img||IMG("trabajo1.jpg");
  q("w-reel").value = w.reel||"";
}

function renderTrabajos(){
  const tbody = document.getElementById("tbody-works");
  if(!tbody) return;
  const admin = isAdmin();
  const thAcc = document.getElementById("th-acciones");
  if (thAcc) thAcc.style.display = admin ? "" : "none";

  const arr = getWorks().sort((a,b)=>a.fecha<b.fecha?1:-1);
  tbody.innerHTML = arr.map((w,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${w.titulo}</td>
      <td><span class="badge">${w.tipo}</span></td>
      <td>${formatDate(w.fecha)}</td>
      <td>${w.descripcion}</td>
      <td>${w.img?`<img src="${w.img}" style="width:64px;height:48px;object-fit:cover;border-radius:6px">`:"-"}</td>
      <td>${w.reel?`<a class="btn" target="_blank" href="${w.reel}">Ver</a>`:"-"}</td>
      <td ${admin?"":"style='display:none'"} >
        <a class="btn" data-edit="${w.id}">Editar</a>
        <a class="btn" data-del="${w.id}">Eliminar</a>
      </td>
    </tr>
  `).join("");

  if(admin){
    tbody.querySelectorAll("[data-edit]").forEach(a=>a.addEventListener("click",()=>{
      const id = a.getAttribute("data-edit");
      const w = getWorks().find(x=>String(x.id)===String(id));
      fillWorkForm(w); scrollTo({top:0,behavior:"smooth"});
    }));
    tbody.querySelectorAll("[data-del]").forEach(a=>a.addEventListener("click",()=>{
      const id = a.getAttribute("data-del");
      if(!confirm("¿Eliminar este trabajo?")) return;
      setWorks(getWorks().filter(x=>String(x.id)!==String(id)));
      renderTrabajos();
    }));
  }
}

function bindAdminUI(){
  const adminBox = document.getElementById("admin-box");
  if (adminBox) adminBox.style.display = isAdmin()? "": "none";

  const clear = document.getElementById("w-clear");
  const save  = document.getElementById("w-save");
  if (clear) clear.addEventListener("click",(e)=>{e.preventDefault(); fillWorkForm({});});
  if (save)  save.addEventListener("click",(e)=>{
    e.preventDefault();
    const q=(id)=>document.getElementById(id);
    const id=q("w-id").value.trim();
    const wNew={
      id:id||Date.now(),
      titulo:(q("w-title").value||"").trim(),
      tipo:q("w-type").value,
      fecha:q("w-date").value,
      descripcion:(q("w-desc").value||"").trim(),
      img:(q("w-img").value||"").trim(),
      reel:(q("w-reel").value||"").trim(),
    };
    if(!wNew.titulo || !wNew.fecha) return alert("Completá Título y Fecha");
    const arr=getWorks();
    const i=arr.findIndex(x=>String(x.id)===String(id));
    if(i>=0) arr[i]=wNew; else arr.push(wNew);
    setWorks(arr); fillWorkForm({}); renderTrabajos();
  });
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded",()=>{
  actualizarNavegacion();
  bindLoginPage();
  bindLogout();

  renderRecursos();
  renderTablaRecursos();
  renderProducto();

  if (document.getElementById("tbody-works")){
    seedWorksIfEmpty(); bindAdminUI(); renderTrabajos();
  }
});
