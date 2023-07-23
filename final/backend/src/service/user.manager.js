import userModel from '../dao/models/User.js';
import {transport} from  "../utils/mailing.js";

class UserManager {

    constructor() {
        this.model = userModel;
    }

    async getUserByEmail(email) {
        return this.model.findOne({ email: email }).populate('cart.products.product').exec();
    }

    async addUsers(elements) { //Agrego 1 o varios elementos
        return this.model.insertMany(elements).exec();
    }

    async getUserById(id) { 
        return this.model.findById(id).exec();
    }

    async getAllUsers() {
        return this.model.find().exec();
    }

    async updateUserLastConnection(id) {
        return await this.model.findByIdAndUpdate(id, { last_connection: Date.now()}, { 'new': true }).exec();
    }

    async deleteUsers() { 
        let timeNow = Date.now(); 
        let users = await this.getAllUsers();

        const usersTimeOut = users.filter(async user => {
            const diffTime = timeNow - user.last_connection;
            const diffMin = diffTime / (1000 * 60); // Convertir la diferencia a minutos
            await transport.sendMail({
                from: 'CoderTest <carolinaeyokoyama@gmail.com>',
                to: user.email,
                subject: 'Cuenta eliminada',
                html: `
                <div> 
                  <p>Su cuenta ha sido eliminada por inactividad. Gracias vuelvas prontos</p>       
                </div>
                `
              })
            return diffMin > 30;
        })

        console.log(usersTimeOut)
        usersTimeOut.forEach(user => this.model.deleteOne(user).exec())
        return usersTimeOut;
    }
}

export default UserManager;