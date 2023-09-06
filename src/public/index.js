const socket = io()
const btn1 = document.getElementById('btn-1')


btn1.addEventListener('click', (e) => {

})


socket.on('connect', () => {
    console.log('Conectado al servidor');
});


socket.on('products', (products) => {
    console.log('Lista de productos recibida desde el servidor:');
    console.log(products);
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});