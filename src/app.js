import express  from 'express';
const app = express();
import handlebars from "express-handlebars"
import { Server } from 'socket.io';
const httpServer = app.listen(8080, () => console.log("ACTIVAU"));
const socketServer = new Server(httpServer);
import prodRouter from './routes/productroute.js'; 
import cartRouter from './routes/cartroute.js'; 
import viewRouter from './routes/viewsroute.js';


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.engine('handlebars', handlebars.engine())

app.set('view engine','handlebars')
app.set('views','./src/views');
app.use(express.static('./src/public'))

app.use((req, res, next) => {
req.context = {socketServer};
next();

})

app.use('/api/products', prodRouter)
app.use('/api/carts', cartRouter)
app.use('/view', viewRouter)






