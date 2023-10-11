import { Router } from "express";
const viewRouter = Router();
import { __dirname } from "../path.js"
import ProductManager from "../dao/database/productmanager.js"
const manager = new ProductManager;
import CartManager from "../dao/database/cartmanager.js";
const cartm = new CartManager;
import { productModel } from "../dao/models/product.model.js";

viewRouter.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});
viewRouter.get('/products', async (req, res) => {
    const pageId = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'asc';
    const query = req.query.query || '';
    const stockQuery = req.query.status || '';

    //Sort
    const sortOptions = {};
    if (sort === "asc") {
        sortOptions.price = 1;
    } else if (sort === "desc") {
        sortOptions.price = -1;
    }

    // filtro por category, description y title
    const filter = {};
    if (query) {
        filter.$or = [
            { category: { $regex: new RegExp(query, 'i') } },
            { title: { $regex: new RegExp(query, 'i') } },
            { description: { $regex: new RegExp(query, 'i') } }
        ];
    }

    if (stockQuery === 'true' || stockQuery === 'false') { filter.status = stockQuery === 'true'; }







    //Paginate:
    const result = await productModel.paginate(
        filter,
        {
            page: pageId, //queremos ir a la pagina x
            limit, // con limite de tantos productos
            sort: sortOptions, // sort con Opciones: asc y desc
            lean: true,
        }
    );

    const prevPage = pageId > 1 ? pageId - 1 : null; // Página previa o null si no hay
    const nextPage = result.hasNextPage ? pageId + 1 : null; // Página siguiente o null si no hay

    const prevLink = prevPage ? `/products?page=${prevPage}` : null;
    const nextLink = nextPage ? `/products?page=${nextPage}` : null;


    const pageNumbers = [];
    if (prevPage) {
        pageNumbers.push({
            number: prevPage,
            link: prevLink,
            isPrevious: true
        });
    }
    pageNumbers.push({
        number: pageId,
        link: `/products/${pageId}/${limit}/${sort}/${query}`,
        isCurrent: true
    });
    if (nextPage) {
        pageNumbers.push({
            number: nextPage,
            link: nextLink,
            isNext: true
        });

    }

    res.render('products', {
        status: "success",
        payload: result.docs,
        products: result.docs,
        prevLink,
        nextLink,
        pageNumbers,
        currentPage: pageId,
        currentLimit: limit,
        currentSort: sort,
        currentQuery: query,
        currentStock: stockQuery,
    });
    const responseObject = {
        status: "success",
        payload: result.docs,
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    };
});


viewRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproducts');
});

viewRouter.get('/chat', async (req, res) =>
    res.render('chat'));

export default viewRouter;