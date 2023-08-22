const express = require('express')
const ProductManager = require('../productmanager');
const manager = new ProductManager('../products.json');
const app = express()

app.get('/products', async (req, res) => {
  const  limit  = req.query.limit;
  const products = await manager.getProducts();

  if (limit){
  return res.send(products.slice(0, limit))
  }
  res.send(products);
  });

app.get ('/products/:pid', async(req, res)=> {
  const id = req.params.pid;
  const productId = await manager.getProductsById(id);
  !productId ?res.status(404).send("Producto no encontrado") : 
  res.send(productId)
   
  });
   


sv.on('error', error => console.log(error))