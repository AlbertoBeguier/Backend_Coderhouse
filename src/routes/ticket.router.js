import express from "express";
import ticketService from "../services/ticket.service.js";

const router = express.Router();

// Ruta para mostrar el ticket por ID
router.get("/:ticketId", async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await ticketService.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.render("ticket", { ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
