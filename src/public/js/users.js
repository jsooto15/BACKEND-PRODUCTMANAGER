

const deleteUser = async (id) =>{
    const res = await fetch(`api/users/${id}`, {
        method:'DELETE'
    })
    console.log(res)
    location.reload()
}
const rolUser = async (id) =>{
    const res = await fetch(`api/users/premium/${id}`, {
			method: "POST",
		})
    console.log(res)
    location.reload()
}