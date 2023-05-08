import ticketModel from '../dao/models/Ticket.js';

class TicketManager {

    constructor() {
        this.model = ticketModel;
    }
    
    async createTicket(products, mail){
        let acum = 0;

        products.forEach(({product, quantity}) => acum += quantity * product.price);

        const ticket = new this.model({amount: acum, purchaser: mail});

        await ticket.save();
        
        return ticket;
    }

}

export default TicketManager;