const socketClient = io();
console.log(io);

const form = document.getElementById('form');

const productListContainer = document.getElementById('productListContainer'); 
// captura de la etiqueta ul (lista vacia)



form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputTitle = document.getElementById('prod-title').value;
    const inputDescription = document.getElementById('prod-description').value;
    const inputPrice = parseFloat(document.getElementById('prod-price').value);
    const inputThumnail = document.getElementById('prod-thumbnail').value;
    const inputCode = parseInt(document.getElementById('prod-code').value, 10);
    const inputStock = parseInt(document.getElementById('prod-stock').value, 10);
    const inputStatus = document.getElementById('prod-status').value;
    const inputCategory = document.getElementById('prod-category').value;

    console.log("formulario enviado");

    console.log("Título:", inputTitle);
    console.log("Descripción:", inputDescription);
    console.log("Precio:", inputPrice);
    console.log("Thumbnail:", inputThumnail);
    console.log("Código:", inputCode);
    console.log("Stock:", inputStock);
    console.log("Status:", inputStatus);
    console.log("Categoría:", inputCategory);



    if (
        !inputTitle ||
        !inputDescription ||
        isNaN(inputPrice) ||
        !inputThumnail ||
        isNaN(inputCode) ||
        isNaN(inputStock) ||
        !inputStatus ||
        !inputCategory
    ) {
        alert('Please complete all the form fields product for add the product');
        return;
    }else{
        alert('Product added successfully');
    }



    socketClient.emit('newProduct', {
        title: inputTitle,
        description: inputDescription,
        price: inputPrice,
        thumbnail: inputThumnail,
        code: inputCode,
        stock: inputStock,
        status: inputStatus,
        category: inputCategory,
    });
});





// DELETE
const deleteProduct = document.getElementById('post-delete')
const inputDelete = document.getElementById('prod-delete')

deleteProduct.addEventListener('click', (event)=>{
    event.preventDefault()
    const idDeleteFromSocketClient = inputDelete.value
    socketClient.emit('deleteProduct', {idDeleteFromSocketClient})
})




socketClient.on('Socket-Products', (productsList) => { 
    //recibimos la lista actualizada de productos
    productListContainer.innerHTML = '';
    productsList.forEach(product => {
        productListContainer.innerHTML = productListContainer.innerHTML + `<li>(id: ${product.id}) ${product.title}</li>`;
    }) 

});
