
// carta.js = maneja la parte de elegir empanadas y guardarlas en el carrito. 
// localStorage = es el puente entre las páginas.

document.addEventListener("DOMContentLoaded", () => {
	
	// 1. Seleccionamos todas las cards de empanadas
	const cards = document.querySelectorAll(".cards-container .card");

	// 2. Recuperar pedido guardado de localStorage (por si el usuario vuelve atrás)
	let pedido = JSON.parse(localStorage.getItem("pedido")) || [];
	 //👉 localStorage = una “cajita” que guarda datos en el navegador.
	// 👉 localStorage.getItem("pedido") busca en la cajita si existe algo con la "llave" llamada "pedido".
	// 👉 Si existe, te devuelve un texto como: '[{"empanada":"Pollo","cantidad":2,"subtotal":8}]'
	// 👉 Si no existe, devuelve null.
	// Por eso usamos JSON.parse(...) para convertir ese texto en un objeto/array que JS pueda entender.
	// Y si es null, con "|| []" usamos un array vacío como reemplazo.

	// 🔥 Guardar el pedido en localStorage, cada vez que cambia el carrito, esta función guarda el array pedido dentro de localStorage.
	function guardarPedido() {
		localStorage.setItem("pedido", JSON.stringify(pedido));
	}
	// 👉 JSON.stringify(pedido) convierte el array en texto JSON.
		// Ejemplo: pedido = [{empanada:"Pollo",cantidad:2,subtotal:8}]
		// stringify → '[{"empanada":"Pollo","cantidad":2,"subtotal":8}]'
		// Así puede guardarse en localStorage (porque solo acepta texto).

	// --------- LÓGICA DE CADA CARD ---------
	//👉 forEach = recorre cada tarjeta (cada empanada).
	cards.forEach((card) => {
		const btnMas = card.querySelector(".btn-mas");
		const btnMenos = card.querySelector(".btn-menos");
		const sumatoria = card.querySelector(".sumatoria");
		const precioElemento = card.querySelector(".cantidad");

    //👉 Agarramos el texto del precio ($4.00), le quitamos el $ y lo convertimos en número (4.00).
		const precioBase = parseFloat(precioElemento.textContent.replace("$", ""));

		// Nombre de la empanada
		const empanada = card.querySelector(".card-title").textContent;

		let itemPedido = pedido.find((p) => p.empanada === empanada);
		let cantidad = itemPedido ? itemPedido.cantidad : 0;
		// 👉 pedido.find(...) busca en el array si ya había un objeto con ese nombre de empanada.
		// Si lo encuentra → devuelve ese objeto.
		// Si no lo encuentra → devuelve undefined. 
		// Si itemPedido existe → usa su cantidad, sino → usa 0

		function actualizarVista() {
			if (cantidad === 0) {
				// nada seleccionado → oculto sumatoria y muestro solo precio base
				sumatoria.textContent = "";
				sumatoria.classList.add("d-none");
				btnMenos.disabled = true;
				precioElemento.textContent = `$${precioBase.toFixed(2)}`;
				// 👉 toFixed(2) redondea el número a 2 decimales.
				// Ejemplo: precioBase = 4 → "4.00"
				// Se asegura que siempre muestre con formato de dinero.
			} else {
				// si hay empanadas → muestro "x2", "x3" y el precio total
				sumatoria.textContent = `x${cantidad}`;
				sumatoria.classList.remove("d-none");
				btnMenos.disabled = false;
				const precioTotal = precioBase * cantidad;
				precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
			}
		}
		actualizarVista(); // refrescamos el inicio

		// 👉 let cantidad = itemPedido ? itemPedido.cantidad : 0;
		// Por defecto arranca en 0, y después se va modificando cada vez que aprietes + o -.
		btnMas.addEventListener("click", () => {
			cantidad++;
			actualizarVista();

		// 👉 Primero busca en el array "pedido" si ya existía esta empanada
			itemPedido = pedido.find((p) => p.empanada === empanada);
			if (itemPedido) {
				// 👉 Si existía, actualiza cantidad y subtotal
				itemPedido.cantidad = cantidad;
				itemPedido.subtotal = precioBase * cantidad;
			} 
			else {
				// 👉 Si no existía, crea un nuevo objeto y lo mete al array
				pedido.push({
					empanada,
					cantidad,
					precioUnitario: precioBase,
					subtotal: precioBase * cantidad,
				});
			}

			guardarPedido(); // 👉 Y siempre después, guardamos el array actualizado en localStorage.
		});

	
		btnMenos.addEventListener("click", () => {
			if (cantidad > 0) {
				cantidad--; // 👉 resta uno a la cantidad
				actualizarVista(); // 👉 actualiza lo que se ve en pantalla

				if (cantidad === 0) {
					// quitar del pedido
					pedido = pedido.filter((p) => p.nombre !== nombre);
					// 👉 filter crea un nuevo array con todos los elementos MENOS el que tenga ese nombre.
					// En este caso, elimina la empanada si ya llegó a 0.
				} else {
					// 👉 Si todavía quedan, actualiza cantidad y subtotal de ese objeto.
					itemPedido.cantidad = cantidad;
					itemPedido.subtotal = precioBase * cantidad;
				}

				guardarPedido(); // 👉 volvemos a guardar el array en localStorage
			}
		});
	});
});
