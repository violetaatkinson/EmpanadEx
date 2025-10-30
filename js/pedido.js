document.addEventListener("DOMContentLoaded", () => { 
  const emptyCardSection = document.querySelector(".empty-card");
  const pedidoSection = document.querySelector(".pedido");
  const pedidoForm = document.querySelector(".pedido-resumen");
  const totalPrecioElemento = pedidoForm.querySelector(".pedido-precio");
  const hr = pedidoForm.querySelector("hr");

  const pedidoGuardado = JSON.parse(localStorage.getItem("pedido")) || [];

  if (pedidoGuardado.length === 0) {
    emptyCardSection.classList.remove("d-none");
    pedidoSection.classList.add("d-none");
    totalPrecioElemento.textContent = `$0.00`;
    hr.style.display = "none";
    return;
  }

  emptyCardSection.classList.add("d-none");
  pedidoSection.classList.remove("d-none");

  let totalGeneral = 0;

  pedidoGuardado.forEach((item, index) => {
    // Contenedor del item
    const div = document.createElement("div");
    div.classList.add("pedido-cont", "item");

    // Info del pedido
    const nombreDiv = document.createElement("div");
    nombreDiv.classList.add("pedido-info");

    const nombreSpan = document.createElement("span");
    nombreSpan.classList.add("pedido-nombre");
    nombreSpan.textContent = item.empanada;
    nombreDiv.appendChild(nombreSpan);

    if (item.empanada.includes("Especial")) {
      const detallesSpan = document.createElement("span");
      detallesSpan.classList.add("pedido-cuanto", "detalle-especial");
      detallesSpan.textContent = item.detalles;
      nombreDiv.appendChild(detallesSpan);
    } else {
      const cantidadSpan = document.createElement("span");
      cantidadSpan.classList.add("pedido-cuanto");
      cantidadSpan.textContent = `${item.cantidad} x $${item.precioUnitario.toFixed(2)}`;
      nombreDiv.appendChild(cantidadSpan);
    }

    // Botón eliminar (tacho)
    const tachoDiv = document.createElement("div");
    tachoDiv.classList.add("pedido-tacho");
    tachoDiv.innerHTML = trashSVG();
    tachoDiv.dataset.index = index;
    tachoDiv.addEventListener("click", () => eliminarItem(index));

    // Precio del item
    const precioDiv = document.createElement("div");
    precioDiv.classList.add("pedido-precio-div");

    const precioSpan = document.createElement("span");
    precioSpan.classList.add("pedido-precio");
    precioSpan.textContent = `$${item.subtotal.toFixed(2)}`;
    precioDiv.appendChild(precioSpan);

    // Insertar todo en el contenedor
    div.appendChild(nombreDiv);
    div.appendChild(tachoDiv);
    div.appendChild(precioDiv);

    // Insertar antes del hr para mantener el total abajo
    pedidoForm.insertBefore(div, hr);

    totalGeneral += item.subtotal;
  });

  // Actualizar total con estilo
  totalPrecioElemento.textContent = `$${totalGeneral.toFixed(2)}`;
  totalPrecioElemento.classList.add("pedido-precio");

  // Mostrar hr solo si hay items
  hr.style.display = pedidoGuardado.length > 0 ? "block" : "none";

  // Evento submit del form
  pedidoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreUsuario = document.getElementById("nombre").value.trim();
    const telefonoUsuario = document.getElementById("telefono").value.trim();

    if (!nombreUsuario || !telefonoUsuario) {
      alert("💡 Por favor, completá tu nombre y teléfono antes de confirmar el pedido 😊");
      return;
    }

    localStorage.setItem("usuario", JSON.stringify({ nombre: nombreUsuario, telefono: telefonoUsuario }));
    const ahora = new Date().getTime();
    localStorage.setItem("pedidoInicio", ahora);

    alert(`✨ ¡Gracias ${nombreUsuario}! Estamos preparando tus empanadas 😋`);

    localStorage.removeItem("pedido");
    window.location.href = "gracias.html";
  });

  function eliminarItem(index) {
    const pedido = JSON.parse(localStorage.getItem("pedido")) || [];
    pedido.splice(index, 1);
    localStorage.setItem("pedido", JSON.stringify(pedido));
    window.location.reload();
  }

  function trashSVG() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2f6bff" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm3 2v9h2v-9H8zm4 0v9h2v-9h-2z"/>
      </svg>
    `;
  }
});
