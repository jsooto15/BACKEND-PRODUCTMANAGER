import { Router } from "express";
const cartRouter = Router()
import CartManager from "../dao/database/cartmanager.js"
const manager = new CartManager()
import ProductManager from "../dao/database/productmanager.js"
const products = new ProductManager()

//Ruta getAllCarts
cartRouter.get('/', async (req,res)=>{
  try {
        const allCarts = await manager.getAllCarts();
        res.json(allCarts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//Ruta addCart
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
//Ruta getProductsInCart
cartRouter.get('/:cid', async (req,res)=>{
  try {
        const cartId = req.params.cid;
        const products = await manager.getProductsInCart(cartId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})
//Ruta addproductincart
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
// Ruta para actualizar el carrito
cartRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid; s
        const updatedCartData = req.body; 

        const cart = await manager.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        if (updatedCartData.products) {
            cart.products = updatedCartData.products;
        }
        await cart.save();

        res.json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Ruta para modificar cantidad
cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    console.log('pid:', pid);


    const cart = await manager.getCartById(cid);
    console.log('Cart:', cart);


    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    } console.log(cart);


    const product = await products.getProductById(pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }console.log();

    await manager.updateProductQuantity(cid, pid, quantity);
    console.log(quantity);
    res.json({ message: 'Product quantity modified!', productId: pid, cartId: cid });
});

// En la ruta DELETE, Eliminar todos los productos de un cart
cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await manager.getCartById(cartId); 
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }


        cart.products = []; 
        await cart.save(); 
        return res.json({ message: 'All products removed from cart' });
    
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Ruta Eliminar Producto por id
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity || 1;

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Cantidad requerida tiene que ser mayor de 0' });
        }

        const cart = await manager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        } console.log
        const product = await products.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await manager.deleteProductFromCart(cid, pid, quantity);
        res.json({ message: 'Producto eliminado del carrito', productId: pid, cartId: cid });

    } catch (error) {
        console.error('Error agregando producto al carrito',error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default cartRouter;