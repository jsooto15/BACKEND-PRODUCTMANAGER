

const deleteUser = async (id) =>{
    const res = await fetch(`api/users/${id}`, {
        method:'DELETE'
    })
    console.log(res)
    location.reload()
}