const socketClient = io()
console.log("io")

const formCreate = document.getElementById("formCreate")

const productListContainer = document.getElementById("productListContainer")
// captura de la etiqueta ul (lista vacia)

formCreate.addEventListener("submit", async (event) => {
	event.preventDefault()

	const inputTitle = document.getElementById("title").value
	const inputDescription = document.getElementById("description").value
	const inputPrice = parseFloat(document.getElementById("price").value)
	const inputThumnail = document.getElementById("thumbnail").value
	const inputCode = document.getElementById("code").value
	const inputStock = parseInt(document.getElementById("stock").value, 10)
	const inputStatus = document.getElementById("status").value
	const inputCategory = document.getElementById("category").value

	console.log("formulario enviado")

	console.log("Título:", inputTitle)
	console.log("Descripción:", inputDescription)
	console.log("Precio:", inputPrice)
	console.log("Stock:", inputStock)
	console.log("Thumbnail:", inputThumnail)
	console.log("Código:", inputCode)
	console.log("Categoría:", inputCategory)
	console.log("Status:", inputStatus)

	if (
		!inputTitle ||
		!inputDescription ||
		isNaN(inputPrice) ||
		!inputThumnail ||
		!inputCode ||
		isNaN(inputStock) ||
		!inputStatus ||
		!inputCategory
	) {
		alert("Please complete all the form fields product for add the product")
		return
	} else {
		// socketClient.emit("newProduct", {
		// 	title: inputTitle,
		// 	description: inputDescription,
		// 	price: inputPrice,
		// 	thumbnail: inputThumnail,
		// 	code: inputCode,
		// 	stock: inputStock,
		// 	status: inputStatus,
		// 	category: inputCategory,
		// })
		try {
			const res = await fetch(`api/products`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: inputTitle,
					description: inputDescription,
					price: inputPrice,
					thumbnail: inputThumnail,
					code: inputCode,
					stock: inputStock,
					status: inputStatus,
					category: inputCategory,
				}),
			})
			const respuesta = await res.json()
			console.log(respuesta)
			alert("Product added successfully")
		} catch (error) {
			console.log(error)
			alert("Error adding this product")
		}finally{
			socketClient.emit("updateProductList", {})
		}
	}
})

// DELETE
const deleteProductBtn = document.getElementById("delete-btn")
const inputDelete = document.getElementById("id-prod")

deleteProductBtn.addEventListener("click", (event) => {
	event.preventDefault()
	const idDeleteFromSocketClient = inputDelete.value
	socketClient.emit("deleteProduct", { idDeleteFromSocketClient })
})

const deleteProduct = async (id) => {
	try {
		const res = await fetch(`api/products/${id}`, {
			method: "DELETE",
		})
		const respuesta = await res.json()
		console.log(respuesta)
		alert("Product deleted successfully")
	} catch (error) {
		console.log(error)
		alert(`Error: ${error.message}`)
	}
	finally{
		socketClient.emit("updateProductList",{})
	}
}

socketClient.on("enviodeproducts", (productsList) => {
	//recibimos la lista actualizada de productos
	productListContainer.innerHTML = ""
	productsList.forEach((product) => {
		productListContainer.innerHTML =
			productListContainer.innerHTML +
			`<li>
                <span>
                ${product.title}

                </span>
                <span>
                ${product.description}

                </span>
                <span>
                ${product.code}

                </span>
                <button onclick="deleteProduct('${product._id}')">
                    Eliminar
                </button>
            </li>`
	})
})
