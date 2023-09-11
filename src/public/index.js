const socket = io()
const prod = document.getElementById('products')


socket.on('conectado', (products)=>{


 products.forEach((i) => {
 const addProduct = document.createElement('div');
 
 addProduct.innerHTML = `<p>Nombre: ${i.title}</p><p>Descripcion: ${i.description}</p>`
 prod.appendChild(addProduct)
  });
})