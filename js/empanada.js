// el código se ejecuta solo después de que el HTML esté cargado, Así evitamos errores de "no se encontró tal botón"
document.addEventListener("DOMContentLoaded", () => {
	//querySelectorAll → agarra todos los elementos con clase .card.h-100 (cada empanada), cards = empanadas
	const cards = document.querySelectorAll(".card.h-100");

	// forEach recorre todas las cards una por una.
	cards.forEach((card) => {
		const btnMas = card.querySelector(".btn-mas");
		const btnMenos = card.querySelector(".btn-menos");
		const sumatoria = card.querySelector(".sumatoria");
		const precioElemento = card.querySelector(".cantidad");

		// obtenemos el Precio Base
		//precioElemento(cantidad de empanadas).textContent → agarra el texto del contenido, ej: "$4.00".
		//.replace('$','') → le quitamos el símbolo $, queda "4.00".
		//parseFloat(...) → lo convierte en número (4). parseFloat("4.00") // 4
		// Ahora tenemos un número matemático con el que podemos multiplicar.
		const precioBase = parseFloat(precioElemento.textContent.replace("$", ""));

		// Empieza en 0 porque al cargar la página todavía no seleccionaste empanadas.
		let cantidad = 0;

		// Estado inicial
		sumatoria.classList.add("d-none"); // a sumatoria se le agrega la clase "d-none"
		btnMenos.disabled = true; // el botón – arranca apagado (no tiene sentido restar si tenés 0).
		// precioElemento.textContent = ... → nos aseguramos que muestre el precio base $4.00 con dos decimales. toFixed(2) agrega decimales
		precioElemento.textContent = `$${precioBase.toFixed(2)}`;

		// Esta función se encarga de actualizar todo cada vez que cambie la cantidad.
		function actualizarVista() {
			// Si la cantidad es 0: -Oculta la sumatoria (d-none), Apaga el botón –, Vuelve a mostrar el precio base ($4.00).
			if (cantidad === 0) {
				sumatoria.textContent = "";
				sumatoria.classList.add("d-none");
				btnMenos.disabled = true;
				precioElemento.textContent = `$${precioBase.toFixed(2)}`;

				// si la cantidad es mayor <0 : Muestra xN en celeste(cantidad), Activa el botón –, Multiplica el precio base por la cantidad → precio dinámico.
			} else {
				sumatoria.textContent = `x${cantidad}`;
				sumatoria.classList.remove("d-none");
				btnMenos.disabled = false;
				// Precio total dinámico
				const precioTotal = precioBase * cantidad;
				precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
			}
		}

		// Botón + Cada click en + suma 1 a la cantidad, Después llama a actualizarVista() para refrescar la pantalla.
		btnMas.addEventListener("click", () => {
			cantidad++;
			actualizarVista();
		});

		// Botón - Cada click en – resta 1 a la cantidad, Solo funciona si la cantidad es mayor a 0 (para que no tengas -1),Llama a actualizarVista() para refrescar todo.
		btnMenos.addEventListener("click", () => {
			if (cantidad > 0) {
				cantidad--;
				actualizarVista();
			}
		});
	});
});
