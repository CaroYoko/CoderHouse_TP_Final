import userModel from '../dao/models/User.js';

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

}

export default UserManager;