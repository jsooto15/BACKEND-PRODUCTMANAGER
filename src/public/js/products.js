const addToCart = async (cid, pid) => {
    const res = await fetch(`/api/cart/${cid}/products/${pid}`, {method: 'POST'});
    console.log(res);
    
    alert(`Product added to cart`);

}