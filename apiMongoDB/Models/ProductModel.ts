import mongoose, { Schema } from "mongoose";
import { ProductParams } from "../dto/Product";

const ProductSchema = new Schema({
    name: {
        type: String, required: true
    },
    images: [{
        type: String, required: true
    }],
    price: {
        type: Number
    },
    oldPrice: {
        type: Number
    },
    description: {
        type: String, required: true
    },
    quantity: {
        type: Number, required: true,
        min: 0,
        max: 9999
    },
    inStock: {
        type: Boolean, default: false
    },
    isFeatured: {
        type: Boolean, default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category"
    },   
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createAt;
            delete ret.updateAt;
        }
    },
    timestamp: true
})

const PRODUCTS = mongoose.model<ProductParams>("products", ProductSchema)

export { PRODUCTS }
