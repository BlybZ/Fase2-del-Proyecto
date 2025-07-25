let cursos = [];

async function cargarDatosCursos() {
  try {
    const response = await fetch('cursos.json');
    if (!response.ok) throw new Error('Error al cargar cursos');
    cursos = await response.json();
    cargarCatalogo();
  } catch (error) {
    console.error('Error:', error);
// Datos de respaldo si falla la carga
    cursos = [
      { id: 1, titulo: "Matemáticas Discretas", descripcion: "Aprende lógica, conjuntos y estructuras discretas.", profesor: "Prof. Bertha Villegas" },
      { id: 2, titulo: "Programación Básica", descripcion: "Estructuras de control, variables y tipos de datos.", profesor: "Prof. Carlos Rodríguez" },
      { id: 3, titulo: "Inglés Técnico", descripcion: "Gramática, vocabulario y comprensión de lectura.", profesor: "Prof. Ana Gómez" }
    ];
    cargarCatalogo();
  }
}

function cargarCatalogo() {
  const contenedor = document.getElementById("catalogo-cursos");
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  
  cursos.forEach(curso => {
    const inscritos = JSON.parse(localStorage.getItem("cursosInscritos")) || [];
    const estaInscrito = inscritos.some(c => c.id === curso.id);
    
    const card = document.createElement("div");
    card.className = "tarjeta-curso";
    card.innerHTML = `
      <h3>${curso.titulo}</h3>
      <p><strong>Profesor:</strong> ${curso.profesor}</p>
      <p>${curso.descripcion}</p>
      <button onclick="inscribirse(${curso.id})" ${estaInscrito ? 'disabled style="background-color: gray;"' : ''}>
        ${estaInscrito ? 'Inscrito' : 'Inscribirse'}
      </button>
    `;
    contenedor.appendChild(card);
  });
}

window.inscribirse = function(idCurso) {
  const curso = cursos.find(c => c.id === idCurso);
  if (!curso) return;
  
  let inscritos = JSON.parse(localStorage.getItem("cursosInscritos")) || [];
  
  if (!inscritos.some(c => c.id === curso.id)) {
    inscritos.push(curso);
    localStorage.setItem("cursosInscritos", JSON.stringify(inscritos));
    mostrarMensaje(`¡Inscripción exitosa en: ${curso.titulo}`, true);
    cargarCatalogo();
    if (document.getElementById("mis-cursos").style.display === "block") {
      mostrarMisCursos();
    }
  } else {
    mostrarMensaje("Ya estás inscrito en este curso.", false);
  }
};

function mostrarMisCursos() {
  const contenedor = document.getElementById("lista-inscritos");
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  const inscritos = JSON.parse(localStorage.getItem("cursosInscritos")) || [];
  
  if (inscritos.length === 0) {
    contenedor.innerHTML = "<p>No estás inscrito en ningún curso aún.</p>";
    return;
  }
  
  inscritos.forEach(curso => {
    const card = document.createElement("div");
    card.className = "tarjeta-curso";
    card.innerHTML = `
      <h3>${curso.titulo}</h3>
      <p><strong>Profesor:</strong> ${curso.profesor}</p>
      <p>${curso.descripcion}</p>
      <button onclick="mostrarMaterialCurso(${curso.id})">Ver Material</button>
    `;
    contenedor.appendChild(card);
  });
}

window.mostrarMaterialCurso = function(idCurso) {
  const curso = cursos.find(c => c.id === idCurso);
  if (!curso) return;
  
  const contenedor = document.getElementById("lista-materiales");
  if (!contenedor) return;
  
  contenedor.innerHTML = `
    <div class="tarjeta-material">
      <h3>${curso.titulo} - Material de estudio</h3>
      <div class="video-thumbnail">
        <h4><i class='bx bx-video'></i> Video: Introducción al curso</h4>
        <p>🎥 Video no disponible para descarga</p>
      </div>
      <div class="pdf-thumbnail">
        <h4><i class='bx bx-file'></i> Documento PDF: Guía de estudio</h4>
        <p>📄 PDF disponible solo para lectura</p>
      </div>
      <div class="link-thumbnail">
        <h4><i class='bx bx-link'></i> Enlaces útiles</h4>
        <p>🔗 <a href="#" onclick="return false;">www.recursos-${curso.titulo.toLowerCase().replace(/\s+/g, '-')}.com</a></p>
      </div>
    </div>
  `;
  
  mostrarSeccion("contenido");
};

function configurarEntregaProyecto() {
  const formulario = document.getElementById("formulario-entrega");
  if (!formulario) return;
  
  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const cursoId = document.getElementById("curso-select").value;
    const archivo = document.getElementById("archivo").files[0];
    const mensaje = document.getElementById("mensaje-entrega");
    
    if (!cursoId) {
      mostrarMensaje("Selecciona un curso", false, "mensaje-entrega");
      return;
    }
    
    if (!archivo) {
      mostrarMensaje("Selecciona un archivo", false, "mensaje-entrega");
      return;
    }
    
    const entregas = JSON.parse(localStorage.getItem("entregasProyectos")) || [];
    const curso = cursos.find(c => c.id == cursoId);
    
    entregas.push({
      cursoId,
      cursoNombre: curso.titulo,
      archivoNombre: archivo.name,
      fecha: new Date().toLocaleString(),
      nota: Math.floor(Math.random() * 5) + 15, // Nota aleatoria entre 15-20
      comentarios: "Buen trabajo, cumple con los requisitos básicos."
    });
    
    localStorage.setItem("entregasProyectos", JSON.stringify(entregas));
    mostrarMensaje(`Proyecto "${archivo.name}" entregado correctamente para ${curso.titulo}`, true, "mensaje-entrega");
    formulario.reset();
  });
}

function mostrarCalificaciones() {
  const contenedor = document.getElementById("detalle-calificaciones");
  if (!contenedor) return;
  
  const entregas = JSON.parse(localStorage.getItem("entregasProyectos")) || [];
  
  if (entregas.length === 0) {
    contenedor.innerHTML = "<p>No has entregado ningún proyecto aún.</p>";
    return;
  }
  
  contenedor.innerHTML = "<h3>Tus Calificaciones</h3>";
  
  entregas.forEach(entrega => {
    const card = document.createElement("div");
    card.className = "tarjeta-curso";
    card.innerHTML = `
      <h4>${entrega.cursoNombre}</h4>
      <p><strong>Archivo:</strong> ${entrega.archivoNombre}</p>
      <p><strong>Fecha de entrega:</strong> ${entrega.fecha}</p>
      <p><strong>Nota:</strong> ${entrega.nota}/20</p>
      <p><strong>Comentarios:</strong> ${entrega.comentarios}</p>
    `;
    contenedor.appendChild(card);
  });
}

function actualizarSelectorCursos() {
  const selector = document.getElementById("curso-select");
  if (!selector) return;
  
  selector.innerHTML = '<option value="">Selecciona un curso</option>';
  const inscritos = JSON.parse(localStorage.getItem("cursosInscritos")) || [];
  
  inscritos.forEach(curso => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = curso.titulo;
    selector.appendChild(option);
  });
}

function mostrarMensaje(texto, esExito, elementoId = null) {
  const elemento = elementoId ? document.getElementById(elementoId) : null;
  if (elemento) {
    elemento.textContent = texto;
    elemento.className = esExito ? 'message success' : 'message error';
    elemento.style.display = 'block';
    setTimeout(() => { elemento.style.display = 'none'; }, 3000);
  } else {
    alert(texto);
  }
}

window.mostrarSeccion = function(id) {
  document.querySelectorAll(".seccion").forEach(sec => {
    sec.style.display = "none";
  });
  
  const seccion = document.getElementById(id);
  if (seccion) {
    seccion.style.display = "block";
    
    switch(id) {
      case "catalogo":
        cargarCatalogo();
        break;
      case "mis-cursos":
        mostrarMisCursos();
        break;
      case "contenido":
// Esto se llenaria al seleccionar un curso específico
        break;
      case "entrega":
        actualizarSelectorCursos();
        break;
      case "calificaciones":
        mostrarCalificaciones();
        break;
    }
  }
};

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  // Mostrar nombre de usuario
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && document.getElementById("welcome-message")) {
    document.getElementById("welcome-message").textContent = `Bienvenido, ${currentUser.name}`;
  }
  
  // Cargar datos iniciales
  cargarDatosCursos();
  configurarEntregaProyecto();
  
  // Mostrar catálogo por defecto
  mostrarSeccion("catalogo");
});