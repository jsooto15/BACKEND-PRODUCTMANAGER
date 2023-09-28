import { Router } from "express";
const prodRouter = Router()

import ProductManager from "../dao/database/productmanager.js"
const manager = new ProductManager;

prodRouter.get('/', async (req, res) => {
    const { limit } = req.query
    const readproduct = await manager.getProducts();
    if (limit) {
        const limitProduct = await readproduct.splice(0, parseInt(limit))
        res.send(limitProduct)
    } else {
        res.send(readproduct)
    }
});

// En la ruta GET, debe devolver un producto específico según el productId
prodRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await manager.getProductById(pid);

        if (product) {
            res.send(product);
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// En la ruta POST, debe agregar un nuevo producto
prodRouter.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            stock,
            thumbnail,
            code,
            status,
        } = req.body;
        const newProd = await manager.addProduct( title, description, price, stock,thumbnail, code,  status);
        
        req.context.socketServer.emit()
        
        res.json(newProd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// En la ruta PUT, debe actualizar el producto
prodRouter.put('/:pid', async (req, res) => {
    try {
        const prod = req.body;
        const { pid } = req.params;
        const prodFind = await manager.getProductById(pid);
        if (prodFind) {
            await manager.updateProduct(pid, prod);
            res.send("Product updated successfully");
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// En la ruta DELETE, debe borrar el producto especificado en la ruta
prodRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const eliminar = await manager.deleteProduct(productId);
        res.json(eliminar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default prodRouter;