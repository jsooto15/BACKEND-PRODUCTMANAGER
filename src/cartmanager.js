import fs from "fs"

class CartManager{
    
      constructor(file){
        this.cart = file || "./carts.json"
        }

    async getCarts() {
        const data = JSON.parse(await fs.promises.readFile(this.cart, 'utf-8'))
        return data
        
    }
    
    async getId() { 
        const data = await this.getCarts()
        return data.length + 1;
    }

    async addCart(newCart){
        newCart.id = await this.getId()
        let data = await this.getCarts()
        data.push(newCart)
        await fs.promises.writeFile(this.cart,JSON.stringify(data))
        
    }
 
    async getCartById (id) {
        let carts = await this.getCarts();
        let cartFind = carts.find((cart) => cart.id == id);
        
        return cartFind
        
    }


  async addProductsToCart(cid, pid , product){
        try {
            const carts = await this.getCarts();
            const selectedCart = carts[cid - 1];
    
            if (selectedCart) {
                const cartProducts = selectedCart.products || [];
                const existingProduct = cartProducts.find(prod => prod.id === pid);
    
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cartProducts.push({ ...product, id: pid, quantity: 1 });
                }
    
                await fs.promises.writeFile(this.cart, JSON.stringify(carts));
            } else {
                console.log("No encontramos el cart");
            }
        } catch (error) {
            console.error("Error añadiendo al cart:", error);
        }
    }
}

const funcionAsync = async () => {
 const cartManager = new CartManager()
  await cartManager.getCartById(1)
}

 //funcionAsync()
 export default CartManager;