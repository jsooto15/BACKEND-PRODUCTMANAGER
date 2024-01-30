const uploadDocs = async (id) => {
	const res = await fetch(`api/users/premium/${id}`, {
		method: "POST",
	})
	console.log(res)
	location.reload()
}
