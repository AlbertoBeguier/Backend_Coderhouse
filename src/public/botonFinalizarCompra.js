document
  .getElementById("finalize-purchase-btn")
  .addEventListener("click", async function () {
    const cartId = this.dataset.cartId;

    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Compra finalizada con éxito. Redirigiendo al ticket.");
        window.location.href = `/ticket/${result.ticket._id}`;
      } else {
        alert("Error al finalizar la compra: " + result.error);
      }
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      alert("Error al procesar la compra.");
    }
  });
