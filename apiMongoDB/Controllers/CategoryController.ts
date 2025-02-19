import { Request, Response } from 'express';
import { CATEGORIES } from '../Models/CategoryModel';
import { CategoryObj, UpdateCategory } from '../dto/Categories';
const path = 'http://localhost:8888/assets/';

export const createCategory = async (req: Request, res: Response) => {
    const { name } = <CategoryObj>req.body;
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => path + file.filename);

    const categories = new CATEGORIES({
        name: name,
        images: images
    });

    try {
        console.log(categories)
        await categories.save();
        res.status(200).json(`Category create successfully :-) + ${path}!!!`)
    } catch (error) {
        res.status(500).json(`Failed to create Category ${error} :-( `)
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const result = await CATEGORIES.findById(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(`Category fetch failed ${error} :-( `)
    }
}

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await CATEGORIES.find()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(`Category not found ${error} :-( `)
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const { name } = <UpdateCategory>req.body;
    const files = req.files as [Express.Multer.File]

    if (files) {
        const images = files.map(file => `${path}${file.filename}`);
        try {
            const catUpdate = await CATEGORIES.findByIdAndUpdate(req.params.id,
                { name: name, images: images }, { new: true })
            res.status(200).json("Category updated successfully")
        } catch (error) {
            res.status(500).json(`The category cannot be updated ${error} :-( `)
        }
    }
    else {
        try {
            const catUpdate = await CATEGORIES.findByIdAndUpdate(req.params.id, { name: name })
            res.status(200).json("Category updated successfully")
        } catch (error) {
            res.status(500).json(`The category cannot be updated ${error} :-( `)
        }
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        res.status(200).json("Category removed successfully!!!!")
    } catch (error) {
        res.status(500).json(`Category delete failed ${error} :-( `)
    }
}
