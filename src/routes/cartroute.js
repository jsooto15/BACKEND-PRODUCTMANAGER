import { Router } from "express";
const cartRouter = Router()
import CartManager from "../dao/database/cartmanager.js"
const manager = new CartManager()
import ProductManager from "../dao/database/productmanager.js"
const products = new ProductManager()


cartRouter.get('/', async (req,res)=>{
  try {
        const allCarts = await manager.getAllCarts();
        res.json(allCarts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

cartRouter.post('/', async (req,res)=>{
   const products = req.body;
  try {
        const cart = { products };
        const cartId = await manager.addCart(cart);
        res.status(201).json({ message: 'Carrito creado', cartId, cart });
    } catch (error) {
        console.error('Error creando el carrito', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

cartRouter.get('/:cid', async (req,res)=>{
  try {
        const cartId = req.params.cid;
        const products = await manager.getProductsInCart(cartId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


cartRouter.post("/:cid/product/:pid",async (req,res)=>{
   try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity || 1;

        if (quantity <= 0) {
            return res.status(400).json({ error: 'cantidad requeridad mayor que 0' });
        }

        const cart = await manager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado'});
        } console.log
        const product = await products.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado'});
        }

        await manager.addProductToCartId(cid, pid, quantity);
        res.json({  message: 'Producto agregado al carrito', productId: pid, cartId: cid});

    } catch (error) {
        console.error('Error agregando el producto', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
export default cartRouter;