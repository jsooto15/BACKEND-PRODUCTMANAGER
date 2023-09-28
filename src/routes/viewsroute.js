import { Router } from "express";
const viewRouter = Router();
import { __dirname } from "../path.js"
import ProductManager from "../dao/database/productmanager.js"
const manager = new ProductManager;

viewRouter.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});

viewRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

viewRouter.get('/chat', async (req, res) => 
    res.render('chat'));

export default viewRouter;