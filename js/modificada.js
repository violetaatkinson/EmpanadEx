// modificada.js = maneja la creación de empanadas personalizadas
document.addEventListener("DOMContentLoaded", () => {
  const createEmpanadaBtn = document.querySelector(".custom-btn.full");
  const listaEspecialesEl = document.querySelector(".especiales-list");
  const totalHighlight = document.querySelector(".summary-row.total .highlight");
  const precioMasa = 0.5; // Precio fijo masa mínima

  // ------------------------------------------
  // FUNCIONES AUXILIARES
  // ------------------------------------------

  function getSeleccionados() {
    return Array.from(document.querySelectorAll(".ingredients input:checked"));
  }

  function precioDesdeInput(input) {
    const muted = input.closest("label").querySelector(".muted").textContent;
    return parseFloat(muted.replace("+ $", "")) || 0;
  }

  function nombreDesdeInput(input) {
    return input.closest("label").querySelector(".text").childNodes[0].textContent.trim();
  }

  function leerPedido() {
    return JSON.parse(localStorage.getItem("pedido")) || [];
  }

  function guardarPedido(pedido) {
    localStorage.setItem("pedido", JSON.stringify(pedido));
  }

  // ------------------------------------------
  // DIBUJAR EMPANADA ESPECIAL EN EL RESUMEN
  // ------------------------------------------
  function dibujarEspecial(item, index) {
    // contenedor principal de la empanada especial
    const div = document.createElement("div");
    div.classList.add("summary-row", "especial-item");

    // BLOQUE 1: Nombre + icono basura + precio
    const bloque1 = document.createElement("div");
    bloque1.classList.add("especial-header");

    const nombreSpan = document.createElement("span");
    nombreSpan.textContent = item.empanada;

    const trashSpan = document.createElement("span");
    trashSpan.classList.add("trash-icon");
    trashSpan.innerHTML = trashSVG();
    trashSpan.style.display = "none"; // oculto por defecto

    const precioSpan = document.createElement("span");
    precioSpan.textContent = `$${item.precioUnitario.toFixed(2)}`;

    bloque1.appendChild(nombreSpan);
    bloque1.appendChild(trashSpan);
    bloque1.appendChild(precioSpan);

    // BLOQUE 2: Ingredientes
    const bloque2 = document.createElement("div");
    bloque2.classList.add("especial-detalles");
    bloque2.textContent = item.detalles;

    div.appendChild(bloque1);
    div.appendChild(bloque2);
    listaEspecialesEl.appendChild(div);

    // mostrar icono basura al pasar mouse
    div.addEventListener("mouseenter", () => {
      trashSpan.style.display = "inline-block";
    });
    div.addEventListener("mouseleave", () => {
      trashSpan.style.display = "none";
    });

    trashSpan.addEventListener("click", () => {
      eliminarEspecial(index);
    });
  }

  // ------------------------------------------
  // CARGAR TODAS LAS ESPECIALES GUARDADAS
  // ------------------------------------------
  function cargarEspeciales() {
    listaEspecialesEl.innerHTML = "";

    const pedido = leerPedido();
    const especiales = pedido.filter(it => it.empanada && it.empanada.includes("Especial"));

    let total = 0;
    especiales.forEach((it, i) => {
      dibujarEspecial(it, i);
      total += it.subtotal;
    });

    // 👉 Si no hay especiales, el total debe ser al menos 0.50
    if (especiales.length === 0) {
      totalHighlight.textContent = `$${precioMasa.toFixed(2)}`;
    } else {
      totalHighlight.textContent = `$${total.toFixed(2)}`;
    }

    // 👉 Mostrar/ocultar hr con clase .espacio-arriba
    const hrEspecial = document.querySelector(".espacio-arriba");
    if (hrEspecial) {
      if (especiales.length === 0) {
        hrEspecial.style.display = "none";
      } else {
        hrEspecial.style.display = "block";
      }
    }
  }

  // ------------------------------------------
  // CREAR NUEVA EMPANADA ESPECIAL
  // ------------------------------------------
  createEmpanadaBtn.addEventListener("click", () => {
    const seleccionados = getSeleccionados();

    if (seleccionados.length === 0) {
      alert("⚠️ Debes seleccionar al menos un ingrediente.");
      return;
    }

    const nombres = seleccionados.map(nombreDesdeInput);
    const precios = seleccionados.map(precioDesdeInput);

    const total = precioMasa + precios.reduce((a, b) => a + b, 0);

    const empanadaEspecial = {
      empanada: "Empanada Especial 🌟",
      detalles: nombres.join(", "),
      cantidad: 1,
      precioUnitario: total,
      subtotal: total
    };

    const pedido = leerPedido();
    pedido.push(empanadaEspecial);
    guardarPedido(pedido);

    cargarEspeciales();

    // limpiar inputs
    document.querySelectorAll(".ingredients input").forEach(i => (i.checked = false));

    alert("🥟🌟 ¡Empanada especial creada, se agregará al pedido!");
  });

  // ------------------------------------------
  // ELIMINAR EMPANADA ESPECIAL
  // ------------------------------------------
  function eliminarEspecial(index) {
    const pedido = leerPedido();
    const especiales = pedido.filter(it => it.empanada && it.empanada.includes("Especial"));
    const realIndex = pedido.indexOf(especiales[index]);

    if (realIndex > -1) {
      pedido.splice(realIndex, 1);
      guardarPedido(pedido);
      cargarEspeciales();
    }
  }

  // ------------------------------------------
  // SVG del icono basura
  // ------------------------------------------
  function trashSVG() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2f6bff" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm3 2v9h2v-9H8zm4 0v9h2v-9h-2z"/>
      </svg>
    `;
  }

  // inicializo cargando especiales guardadas
  cargarEspeciales();
});
