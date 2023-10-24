// crear una función autoejecutable para ver si existe un idcart en el localstorage
// si no existe entonces crear un carrito nuevo y guardarlo en el localstorage

const getCartId = async () => {
    const res = await fetch("/api/sessions/current")
    const currentUser = await res.json()
    console.log(currentUser?.data)
    let cartId = currentUser?.data?.cart;
    if (!cartId) {
        const cart = await fetch('/api/carts', { method: 'POST' });
        const cartData = await cart.json();
        const response = await fetch(`/api/users/${currentUser?.data?._id}`,{method:'PUT', body:{cart:cartData.cartId}})
        const updatedUser = await response.json()
        console.log('user updated',updatedUser)
        cartId = cartData.cartId
    }
    return cartId
};


const addToCart = async (pid) => {
    const cid = await getCartId();
    const url = `/api/carts/${cid}/product/${pid}`;
    const res = await fetch(url, {method: 'POST'});
    if(!res.ok || res.status === 500) {
        return alert('Error adding product to cart');
    }
    if(res.status === 404) {
        return alert('Product not found');
    }
    const response = await res.json()
    console.log('Product added to cart',response);
    alert(`Product added to cart`);

}

 