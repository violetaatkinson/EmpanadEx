// pedido.js = lee lo guardado, lo muestra y permite confirmar.
document.addEventListener("DOMContentLoaded", () => {
  const emptyCardSection = document.querySelector(".empty-card"); // mensaje si el carrito está vacío
  const pedidoSection = document.querySelector(".pedido"); // bloque con el resumen del pedido
  const pedidoForm = document.querySelector(".pedido-form");
  const totalPrecioElemento = pedidoForm.querySelector(".pedido-precio"); // donde se muestra el total

  // 👉 Traemos el carrito desde localStorage. Si no había nada → array vacío.
  const pedidoGuardado = JSON.parse(localStorage.getItem("pedido")) || [];

  if (pedidoGuardado.length === 0) {
    // si el pedido está vacío, mostramos mensaje y ocultamos resumen
    emptyCardSection.classList.remove("d-none");
    pedidoSection.classList.add("d-none");
    return;
  }

  // Sí hay pedido → mostramos el resumen
  emptyCardSection.classList.add("d-none");
  pedidoSection.classList.remove("d-none");

  let totalGeneral = 0;
  const hr = pedidoForm.querySelector("hr");

  pedidoGuardado.forEach((item) => {
    const div = document.createElement("div"); // creo un div
    div.classList.add("pedido-cont", "item"); // le agrego clases

    // 👉 Aquí se cambia la lógica para mostrar ingredientes si es especial
    div.innerHTML = `
      <div>
        <h6 class="pedido-nombre">${item.empanada}</h6>
        ${
          item.empanada.includes("Especial")
            ? `<span class="pedido-detalles" style="font-size:0.85rem;color:#555;display:block;margin-top:3px;">${item.detalles}</span>`
            : `<span class="pedido-cuanto">${item.cantidad} x $${item.precioUnitario.toFixed(2)}</span>`
        }
      </div>
      <h6 class="pedido-precio">$${item.subtotal.toFixed(2)}</h6>
    `;

    // 👉 Inserta el div antes del <hr> dentro del formulario
    pedidoForm.insertBefore(div, hr);

    // 👉 Sumar subtotales para calcular total general
    totalGeneral += item.subtotal;
  });

  totalPrecioElemento.textContent = `$${totalGeneral.toFixed(2)}`;

  // Confirmar pedido
  if (pedidoForm) {
    pedidoForm.addEventListener("submit", (e) => {
      e.preventDefault(); // evitamos recarga de página
      localStorage.removeItem("pedido"); // vaciamos carrito
      window.location.href = "gracias.html"; // redirigimos
    });
  }
});
