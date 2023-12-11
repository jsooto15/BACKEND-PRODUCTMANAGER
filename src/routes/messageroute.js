import { Router } from "express";
import { index, store } from "../controllers/message.controller.js";
import { isUser } from "../middlewares/index.js";

const messageRouter = Router()

messageRouter.get('/', index);
messageRouter.post('/', isUser, store);

export default messageRouter;