import { messageModel } from "../models/messagemodel.js";

export default class MessagesManager {
  async getMessages(){
      try {
        return await messageModel.find().lean();
      } catch (error) {
        return error;
      }
    }
  
  async createMessage(message){
      try {
        return await messageModel.create(message);
      } catch (error) {
        return error;
      }
    }
  }