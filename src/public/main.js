// generar una instancia de socket.io desde el lado del cliente
const socket = io();
// uso de socket.io en el lado del cliente para enviar mensajes al backend uso el método emit
socket.emit("mensaje", "Hola desde el cliente");

//para recibir mensajes del backend uso el método on
socket.on("mensaje1", data => {
  console.log("Mensaje del servidor:", data);
});
