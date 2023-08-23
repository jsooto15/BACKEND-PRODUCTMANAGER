const express = require('express')
const ProductManager = require('../productmanager.js');
const productmanager = new ProductManager('../products.json');
const app = express()

app.get('/products', async (req, res) => {
  const  limit  = req.query.limit;
  const products = await productmanager.getProducts();

  if (limit){
  return res.send(products.slice(0, limit))
  }
  res.send(products);
  });

app.get ('/products/:pid', async(req, res)=> {
  const iD = req.params.pid;
  const productId = await productmanager.getProductsById(iD);
  res.send(productId);
   
  });

  app.listen(8080, () => console.log("Activo"))