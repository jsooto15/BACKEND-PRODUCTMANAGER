const fs = require('fs')
class ProductManager{

    products; 

       constructor(){
       this.products = []
       this.path = './products.json';
      }

      async getProducts() {
      const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
      return data
      }

      async getProdId() { 
      let data  =  await this.getProducts()
      return data.length + 1;}

      async addProduct(title,description,price,thumbnail,code,stock){ 
      const newProduct={
      title, 
      description,
      price,
      thumbnail,
      code,
      stock}
                   
      try{
      if(!fs.existsSync(this.path)){
      const emptyList = []
      emptyList.push({...newProduct,id: await this.getProdId()})
      await fs.promises.writeFile(this.path, JSON.stringify(emptyList, null, '\t'))}

      else{
      const data = await this.getProducts()
      const repeatCode = data.some(e => e.code == newProduct.code)
      repeatCode == true ? console.log("Codigo ya en uso") : data.push({...newProduct,id: await this.getProdId()})
      await fs.promises.writeFile(this.path,JSON.stringify(data,null, '\t'))
      }
      }

      catch(error){
      console.log(error)}
      }
      // Funcion Cargar Productos 
      async updateProducts(id , product){
      let data = await this.getProducts()
      let i = data.findIndex(e => e.id === id)
      product.id = id
      data.splice(i,1,product)
      await fs.promises.writeFile(this.path, JSON.stringify(data))
      }
      // Funcion Obtener productos mediante ID
      async getProductsById(id){
      const data = await this.getProducts()
      let productFind = data.find( e => e.id == id ) 
      return productFind === undefined ?console.log("Not found"): productFind
      }
      // Funcion Eliminar productos 
      async deleteProduct(id){
      const data = await this.getProducts()
      let i = data.findIndex(e => e.id === id)
      data.splice(i,1)
      await fs.promises.writeFile(this.path, JSON.stringify(data))}
}

const functionayc = async () => {
const productManager = new ProductManager()
console.log(await productManager.getProducts())
await productManager.addProduct("Samsung S23 Ultra","Black 512gb 12gb ram",1100,"./IMG/photo.png","SU5952",7, )
await productManager.addProduct("Iphone 14 Pro Max","White 512gb",1280,"./IMG/photo1.png","AP3456",10)
await productManager.addProduct("Iphone 13","Purple 128gb",800,"./IMG/photo2.png","AP5623",5)
await productManager.getProducts()
console.log(await productManager.getProducts())
await productManager.addProduct("Samsung S23 Ultra","Black 512gb 12gb ram",1100,"./IMG/photo.png","SU5952",7, )


await productManager.getProductsById(1)
await productManager.updateProducts(1,{"title": "Iphone 14","description": "Silver Black 128gb","price": 950,"thumbnail": "./IMG/photo4.png","code": "AP4852","stock": 16})
await productManager.deleteProduct(2)
// En esta parte simula un caso de uso donde, 1- crea 3 productos, 2- Manejo de codigos duplicados 3- Muestra los productos, 4- Edita un producto que seria Id:1, 5- Elimina el producto  id:2. Y como resultado quedaria dos productos que serian el que se modifico y el tercer producto agregado y con esto se termina el CRUD 

// El resultado final quedaria en el archivo products.json 
};
functionayc()
