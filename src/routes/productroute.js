import { Router } from "express";
const prodRouter = Router()
import ProductManager from "../productmanager.js"
const manager = new ProductManager("./src/products.json");

let productadd = {
    title: "Iphone XR",
    descripction: "Red 128GB",
    price: 340,
    thumbnail: "./IMG/photo4.png",
    code: "AP5696",
    stock: 9,
    status: true,
  };



prodRouter.get("/", async (req, res) => {
    let { limit } = req.query;
    let products = await manager.getProducts();
    res.send(products.slice(0, limit));
  });




  prodRouter.get("/:pid", async(req, res)=> {
    let id = req.params.pid;
    let productId = await manager.getProductsById(id);
   !productId ?res.status(404).send("Produccto no encontrado") : res.send(productId)
   
   });


    prodRouter.post("/", async(req,res)=> { 
 
    await manager.addProduct(productadd)
    res.send("Agregado correctamente")
    req.context.socketServer.enit()
 })
 

    prodRouter.put("/:pid" , async(req,res)=>{

        let id = parseInt(req.params.pid);
        let update = req.body;
        await manager.updateProducts(id, update);
        res.send("Actualizacion del producto");


    })

     
    prodRouter.delete("/:pid" , async (req , res)=> {
   
        let id = parseInt (req.params.pid);
        await manager.deleteProduct(id)
        res.send("Producto eliminado")
    })

   

   export default prodRouter;