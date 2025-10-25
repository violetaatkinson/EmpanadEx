document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar elementos del DOM
  const nombreSpan = document.getElementById("usuario-nombre");
  const countdownSpan = document.getElementById("countdown");
  const progressBar = document.getElementById("progress-bar");

  if (!nombreSpan || !countdownSpan || !progressBar) {
    console.error("⚠️ No se encontraron los elementos necesarios en el DOM.");
    return;
  }

  // Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario")) || { nombre: "Cliente" };
  nombreSpan.textContent = usuario.nombre;

  // Tiempo total del pedido (20 minutos)
  const tiempoTotal = 20 * 60 * 1000; // en milisegundos (20 minutos)
  const inicio = parseInt(localStorage.getItem("pedidoInicio")) || new Date().getTime();
  const fin = inicio + tiempoTotal;

  // 🕒 Función para actualizar la cuenta regresiva
  function actualizarCountdown() {
    const ahora = new Date().getTime();
    let tiempoRestante = fin - ahora;

    // Si el tiempo se terminó
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      countdownSpan.textContent = "00:00";
      progressBar.style.width = "100%";

      setTimeout(() => {
        countdownSpan.textContent = "¡Tu pedido está listo 🍽️!";
      }, 1000);
      return;
    }

    const minutos = Math.floor(tiempoRestante / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

    countdownSpan.textContent = `${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;

    // Actualizar barra de progreso
    const porcentaje = ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100;
    progressBar.style.width = `${porcentaje}%`;
  }

  // 🔁 Ejecutar cada segundo
  actualizarCountdown();
  const intervalo = setInterval(actualizarCountdown, 1000);
});
