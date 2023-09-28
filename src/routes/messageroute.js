import { Router } from "express";
import { messageModel } from "../dao/models/messagemodel.js";

const messageRouter = Router()

messageRouter.get('/', async (req, res) =>{
 const messages =await messageModel.find();
 res.send(messages);
});

messageRouter.post('/', async (req, res) => {
 const {user, text} = req.body;
 if (!user || !text){
    res.status(400).send({ error:'Error'})
 }
 const messages = await messageModel.create({
 user,
 text,
 });
 res.send(messages);
})
export default messageRouter;