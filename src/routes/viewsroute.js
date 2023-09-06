import { Router } from "express";
const viewRouter = Router();
import ProductManager from "../productmanager.js"
const manager = new ProductManager("./src/products.json");

viewRouter.get('/realtimeproducts', async (req,res)=> { 
   let products = await manager.getProducts()
   res.render('home', {products})
   
    req.context.socketServer.on('Conectando',(socket) => {
      console.log( `Conectado ${socket.id}`);
      req.context.socketSv.emit('products',products)
  
  })
})

export default viewRouter;