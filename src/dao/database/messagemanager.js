import { messageModel } from "../models/message.model.js";

export default class MessagesManager {
  //Muestra los mensajes
  async getMessages(){
      try {
        return await messageModel.find().lean();
      } catch (error) {
        return error;
      }
    }
  //Crea un mesaje 
  async createMessage(message){
      try {
        return await messageModel.create(message);
      } catch (error) {
        return error;
      }
    }
  }