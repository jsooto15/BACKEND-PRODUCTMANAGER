// crear una función autoejecutable para ver si existe un idcart en el localstorage
// si no existe entonces crear un carrito nuevo y guardarlo en el localstorage
/*(async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        const cart = await fetch('/api/carts', { method: 'POST' });
        const cartData = await cart.json();
        localStorage.setItem('cartId', cartData.cartId);
    }
})();


const addToCart = async (pid) => {
    const cid = localStorage.getItem('cartId') || '';
    const url = `/api/carts/${cid}/product/${pid}`;
    const res = await fetch(url, {method: 'POST'});
    if(!res.ok || res.status === 500) {
        return alert('Error adding product to cart');
    }
    if(res.status === 404) {
        return alert('Product not found');
    }
    console.log('Product added to cart',res.body);
    alert(`Product added to cart`);

}*/

const addToCart = async (cid, pid) => {
    const res = await fetch(`/api/cart/${cid}/products/${pid}`, {method: 'POST'});
    //const json = await res.json();
    console.log(res);
    
    alert(`Product added to cart`);

}

 