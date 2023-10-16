const socketClient = io();
console.log(io);

const form = document.getElementById('form');

const productListContainer = document.getElementById('productListContainer'); 
// captura de la etiqueta ul (lista vacia)



form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputTitle = document.getElementById('title').value;
    const inputDescription = document.getElementById('description').value;
    const inputPrice = parseFloat(document.getElementById('price').value);
    const inputThumnail = document.getElementById('thumbnail').value;
    const inputCode = parseInt(document.getElementById('code').value, 10);
    const inputStock = parseInt(document.getElementById('stock').value, 10);
    const inputStatus = document.getElementById('status').value;
    const inputCategory = document.getElementById('category').value;

    console.log("formulario enviado");

    console.log("Título:", inputTitle);
    console.log("Descripción:", inputDescription);
    console.log("Precio:", inputPrice);
    console.log("Stock:", inputStock);
    console.log("Thumbnail:", inputThumnail);
    console.log("Código:", inputCode);
    console.log("Categoría:", inputCategory);
    console.log("Status:", inputStatus);
    



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
const deleteProduct = document.getElementById('delete-btn')
const inputDelete = document.getElementById('id-prod')

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
