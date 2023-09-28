import { cartModel } from "../models/cart.models.js";

export default class CartManager{
     async getAllCarts() {
        const carts = await cartModel.find().lean();
        return carts;
    }

    async addCart(cart) {
       

        const newCart = await cartModel.create(cart);
        
        return newCart.id;
    }

    async getCartById(id) {
        const cart = await cartModel.findOne( {_id: id} );
        return cart;
    }

    async getProductsInCart(cartId) {
        const cart = await this.getCartById(cartId);

        if (cart) {
            return cart.products;
        } else {
            console.log('Carrito no encontrado');
            return [];
        }
    }

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
}