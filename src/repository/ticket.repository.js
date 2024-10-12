export default class TicketRepository {
  constructor(ticketDAO) {
    this.ticketDAO = ticketDAO;
  }

  async createTicket(ticketData) {
    return await this.ticketDAO.createTicket(ticketData);
  }

  async getTicketById(ticketId) {
    return await this.ticketDAO.getTicketById(ticketId);
  }
}
