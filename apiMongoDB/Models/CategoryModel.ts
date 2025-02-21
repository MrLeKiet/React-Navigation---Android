import mongoose, { Schema } from "mongoose";
import { CategoryObj } from "../dto/Category";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        images: {
            type: [String]
        }
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
    }
);

const CATEGORIES = mongoose.model<CategoryObj>("categories", CategorySchema)

export { CATEGORIES }
