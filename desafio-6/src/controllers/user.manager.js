import userModel from '../dao/models/User.js';

class UserManager {

    constructor() {
        this.model = userModel;
    }

    async getUserByEmail(email) {
        return await this.model.findOne({ email: email });
    }

    async addUsers(elements) { //Agrego 1 o varios elementos
        return await this.model.insertMany(elements);
    }
}

export default UserManager;