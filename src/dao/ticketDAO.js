export default class TicketDAO {
  constructor(ticketModel) {
    this.ticketModel = ticketModel;
  }

  async createTicket(ticketData) {
    try {
      const ticket = new this.ticketModel(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error("Error al crear el ticket: " + error.message);
    }
  }

  async getTicketById(ticketId) {
    try {
      return await this.ticketModel.findById(ticketId);
    } catch (error) {
      throw new Error("Error al obtener el ticket: " + error.message);
    }
  }
}
