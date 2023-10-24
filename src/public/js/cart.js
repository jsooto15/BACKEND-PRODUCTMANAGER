const listContainer = document.getElementById("cartContainer")
const renderList = (lista)=>{
    return `<table>
    <thead>
    <tr>
        <th>
            Imagen
        </th>
        <th>
            Nombre
        </th>
        <th>
            Precio
        </th>
        <th>
            Cantidad
        </th>
        <th>
            Acciones
        </th>
    </tr>
    </thead>
    <tbody>
        ${lista}
    </tbody>
</table>`
} 

const getCartProducts = async ()=>{
    listContainer.innerHTML = `<h4>Cargando...<h4/>`
    const cartId = await getCartId()
    const res = await fetch(`/api/carts/${cartId}`)
    const data = await res.json()
    if(data?.length > 0){
        const listaStr = data.map(
					({ product, quantity }) => `
            <tr>
                <td><img src="${product.thumbnail}" style="width:64px;height:64px" /></td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${quantity}</td>
                <td>
                <button onclick="deleteCartProduct('${product._id}')">
                    Eliminar
                </button>
                </td>
            <tr/>
        `
				).join(" ")
        listContainer.innerHTML = renderList(listaStr)
        
    }else{
        listContainer.innerHTML = `<h4>No hay productos en el carrito<h4/>`
        
    }
    console.log(data)
}

const deleteCartProduct = async (pid)=>{
    const cartId = await getCartId()
    const res = await fetch(`api/carts/${cartId}/products/${pid}`,{method:'DELETE'})
    const data = await res.json()
    console.log(data)
    await getCartProducts()
}

getCartProducts()
