import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const productCollection = "products";
/**
 * @openapi
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         title: 
 *           type: string
 *           example: t-shirt
 *         description:
 *           type: string
 *           example: some description
 *         price:
 *           type: number
 *           example: 22.45
 *         stock:
 *           type: number
 *           example: 12
 *         thumbnail:
 *           type: string
 *           example: https://images.google.com/happy-duck
 *         code: 
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         owner: 
 *           type: string
 *           example: Tommy V  
 *         category: 
 *           type: string
 *           example: clothes
 *         status: 
 *           type: boolean
 *           example: true  
 *     RequestProduct:
 *       type: object
 *       properties:
 *         title: 
 *           type: string
 *           example: t-shirt
 *         description:
 *           type: string
 *           example: some description
 *         price:
 *           type: number
 *           example: 22.45
 *         stock:
 *           type: number
 *           example: 12
 *         thumbnail:
 *           type: string
 *           example: https://images.google.com/happy-duck
 *         code: 
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         category: 
 *           type: string
 *           example: clothes
 *         status: 
 *           type: boolean
 *           example: true  
 * 
*/
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    thumbnail: {
        type: String,
        required: false 
    },
    code: {
        type: String,
        unique: true, 
        required: true
    },
    owner:{
        type:String,
        required:true
    },
    category: {
        type: String,
        // required: true
    },
    status: {
        type: Boolean,
        default: true 
    },

});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);
export {productModel};