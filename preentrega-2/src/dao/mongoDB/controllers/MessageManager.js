import messageModel from '../models/Message.js';

class MessageManager {

  constructor() {
    this.model = messageModel;
  }

  async addElement(element) {  
    return await this.model.collection.insertOne(element);
  }

  async getElements() {
    return await this.model.find().exec();
  }

  async getElementById(id) { 
    return await this.model.findById(id).exec();
  }

  async updateElement(id, info) {
    return await this.model.findByIdAndUpdate(id, info).exec();
  }

  async deleteElement(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }

}

export default MessageManager;