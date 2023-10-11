const addToCart = async (cid, pid) => {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, {method: 'POST'});
    console.log(res);
    
    alert(`Product added to cart`);

}