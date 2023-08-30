import express  from 'express';
const app = express();
import prodRouter from './routes/productroute.js'; 
import cartRouter from './routes/cartroute.js'; 

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', prodRouter)
app.use('/api/carts', cartRouter)




app.listen(8080, () => console.log("ACTIVAU"));

