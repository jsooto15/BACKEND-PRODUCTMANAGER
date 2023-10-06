import { cartModel } from "../models/cart.models.js";

export default class CartManager{
    //Muestra todos los carritos
     async getAllCarts() {
        const carts = await cartModel.find().lean();
        return carts;
    }
    //Agregando un carrito
    async addCart(cart) {
       

        const newCart = await cartModel.create(cart);
        
        return newCart.id;
    }
    //Muestra un carrito por id
    async getCartById(id) {
        const cart = await cartModel.findOne( {_id: id} );
        return cart;
    }
    //Muestra los productos en el carrito
    async getProductsInCart(cartId) {
        const cart = await this.getCartById(cartId);

        if (cart) {
            return cart.products;
        } else {
            console.log('Carrito no encontrado');
            return [];
        }
    }
    // Agrega producto en carrito
    async addProductToCartId(cid, productId) { 
        const cart = await this.getCartById(cid); 
        console.log(cart);

        let item = cart.products.find((p) => p.product === productId); 
        console.log(productId);
        if (item) { 
            item.quantity++; 
        } else { 
            item = { product: productId, quantity: 1 }; 
            console.log(item);
            cart.products.push(item); 
        } 
        console.log(cart);
        await cart.save(); 
        return item; 
    }
    //Eliminar producto del carrito con el id
    async deleteProductFromCart(cid, pid) {
    try {
        console.log(`Eliminando producto: ${pid} del carrito: ${cid}`);
        const cart = await this.getCartById(cid);

        const itemIndex = cart.products.findIndex((product) => product.product.toString() === pid);

        if (itemIndex !== -1) {
            // Si se encuentra el producto en el carrito, eliminarlo
            cart.products.splice(itemIndex, 1);
        } else {
            console.log(`Producto de id: ${pid} no encontrado en el carrito.`);
        }

        console.log(`Cart after deleted product: ${(cart)}`);
        await cart.save();
        return pid; 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
    }
    //Actualizando el carrito
    async updateProductQuantity(cid, pid, quantity) {
    try {
    const cart = await cartModel.findById(cid);
    console.log(cart, "CARRITO ENCONTRADO")
    if (!cart) {
        throw new Error("Carrito no encontradi");
    }

    const productToUpdate = cart.products.find(
        (product) => product.toString() === pid
    );    console.log(productToUpdate, "PRODUCTO ENCONTRADO")
    if (!productToUpdate) {
        throw new Error("Producto no encontrado");
    }

    productToUpdate.quantity = quantity;
    await cart.save();

    return cart;
    } catch (error) {
    console.log(error);
    }
    }
}