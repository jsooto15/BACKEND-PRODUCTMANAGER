import { productModel } from "../models/product.model.js";
export default class ProductManager
{
 /*async categories() {
        try {
            const categories = await productModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])

            return categories[0].categories

        }
        catch (err) {
            console.log(err);
            return err
        }

    }
    async getProductsView() {
        try {
            return await productModel.find().lean();

        } catch (err) {
            return err
        }
    };*/

  //Muestra los productos  
  async getProducts() {
      const products = await productModel.find({}).lean();
        console.log(products);
        return products;
    }
  //Muestra un producto por su id
  async getProductById(id) {
        const product = await productModel.find({ _id: id }).lean();
        return product;
    }
  //Agregando producto
    async addProduct( title, description, price, stock, thumbnail, code,category, status) {
        const newProduct = {

            title,
            description,
            price,
            stock,
            thumbnail,
            code,
            category,
            status,
            
        };
        const repeatCode = await productModel.find({ code: newProduct.code });
       
        if (!repeatCode) {
            console.log("Codigo invalido")
            return;
        }
        try {
            const products = await productModel.create(newProduct);
            return products;

        } catch (error) {
            console.log(error);
        }
    }
   //Actualiza un producto
    async updateProduct(id, obj) {
        await productModel.updateOne({ _id: id }, obj).lean();
        return obj;
    }
   //Elimina un producto
    async deleteProduct(id) {
        try {
            const products = await productModel.findByIdAndDelete(id);
            return products;
        } catch (error) {
            console.log(error);
        }
    }


}