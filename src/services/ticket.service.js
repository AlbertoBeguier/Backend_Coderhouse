import TicketRepository from "../repository/ticket.repository.js"; // Asegúrate de que esta importación sea correcta
import TicketDAO from "../dao/ticketDAO.js";
import TicketModel from "../models/ticket.model.js";

class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository(new TicketDAO(TicketModel));
  }

  async createTicket(purchaser, products, totalAmount) {
    const productsForTicket = products.map((item) => ({
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const ticketData = {
      purchaser,

      amount: totalAmount,
      products: productsForTicket,
    };

    return await this.ticketRepository.createTicket(ticketData);
  }

  async getTicketById(ticketId) {
    return await this.ticketRepository.getTicketById(ticketId);
  }
}

export default new TicketService();
