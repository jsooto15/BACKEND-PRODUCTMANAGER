import mongoose from "mongoose";
const cartCollection = "carts";

/**
 * @openapi
 * components:
 *   schemas:
 *     Carts:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product: 
 *                 type: string
 *                 example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *               quantity: 
 *                 type: number
 *                 example: 120
 *     RequestCart:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product: 
 *                 type: string
 *                 example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *               quantity: 
 *                 type: number
 *                 example: 120
*/

const cartSchema = new mongoose.Schema({
products: [
       {
        product: {type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number }
       }
    ]
});

const cartModel = mongoose.model(cartCollection, cartSchema);
export {cartModel};