const socketClient=io()


socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(products) {
    let div = document.getElementById("products");
    let productos = "";
  
    products.forEach((product) => {
      productos += `
  <article class="container" id="products">
 <div class="card" style="width: 18rem;">
  <img src="${product.thumbnail}" class="card-img-top">
  <div class="card-body">
    <h2 class="card-title">${product.title}</h2>
    <p class="card-text">${product.description}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Pirce: ${product.price}$</li>
    <li class="list-group-item">Disponibilidad: ${product.stock}</li>
  </ul>
  <div class="card-body">
   <a href="#" class="btn btn-primary">Comprar</a>
  </div>
</div>
</article>
          
          `;
    });
  
    div.innerHTML = productos;
  }


  let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let price = form.elements.price.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let code = form.elements.code.value;

  socketClient.emit("addProduct", {
    title,
    description,
    price,
    stock,
    thumbnail,
    code,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value;
    console.log(deleteid)
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });