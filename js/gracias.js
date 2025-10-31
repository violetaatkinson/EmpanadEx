document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar elementos del DOM
  const nombreSpan = document.getElementById("usuario-nombre");
  const countdownSpan = document.getElementById("countdown");
  const progressBar = document.getElementById("progress-bar");
  const textoPedido = document.querySelector(".tiempo-texto"); // Texto tipo "Tu pedido estará listo en …"

  if (!nombreSpan || !countdownSpan || !progressBar) {
    console.error("⚠️ No se encontraron los elementos necesarios en el DOM.");
    return;
  }

  // Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario")) || { nombre: "Cliente" };
  nombreSpan.textContent = usuario.nombre;

  // Tiempo total del pedido (20 minutos)
  const tiempoTotal = 20 * 60 * 1000; // 20 minutos en milisegundos
  const inicio = parseInt(localStorage.getItem("pedidoInicio")) || new Date().getTime();
  const fin = inicio + tiempoTotal;

  // Función para actualizar la cuenta regresiva y la barra
  function actualizarCountdown() {
    const ahora = new Date().getTime();
    let tiempoRestante = fin - ahora;

    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      countdownSpan.textContent = "00:00";
      progressBar.style.width = "100%";

      // Quitar el texto de preparación si existe
      if (textoPedido) textoPedido.textContent = "";

      // Mostrar mensaje final después de 1 segundo
      setTimeout(() => {
        countdownSpan.textContent = "¡Tu pedido está listo 🍽️!";
      }, 1000);

      return;
    }

    // Calcular minutos y segundos
    const minutos = Math.floor(tiempoRestante / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

    countdownSpan.textContent = `${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;

    // Actualizar barra de progreso
    const porcentaje = ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100;
    progressBar.style.width = `${porcentaje}%`;
  }

  // Ejecutar actualización inmediatamente y luego cada segundo
  actualizarCountdown();
  const intervalo = setInterval(actualizarCountdown, 1000);
});
