document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("usuario-nombre");
  const countdownSpan = document.getElementById("countdown");
  const progressBar = document.getElementById("progress-bar");

  // Obtener datos guardados
  const usuario = JSON.parse(localStorage.getItem("usuario")) || { nombre: "Cliente" };
  nombreSpan.textContent = usuario.nombre;

  const inicio = parseInt(localStorage.getItem("pedidoInicio")) || new Date().getTime();
  const tiempoTotal = 20 * 60 * 1000; // 20 minutos
  const fin = inicio + tiempoTotal;

  function actualizarCountdown() {
    const ahora = new Date().getTime();
    let tiempoRestante = fin - ahora;

    if (tiempoRestante < 0) {
      tiempoRestante = 0;
      clearInterval(intervalo);
    }

    const minutos = Math.floor(tiempoRestante / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
    countdownSpan.textContent = `${minutos.toString().padStart(2,"0")}:${segundos.toString().padStart(2,"0")}`;

    // Barra de progreso
    const porcentaje = ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100;
    progressBar.style.width = porcentaje + "%";
  }

  actualizarCountdown();
  const intervalo = setInterval(actualizarCountdown, 1000);
});
