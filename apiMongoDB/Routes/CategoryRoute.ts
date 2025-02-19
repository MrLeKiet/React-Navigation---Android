import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../Controllers/CategoryController'
import { get } from 'http';

const router = express.Router();
const imagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name + "-" + Date.now() + path.extname(file.originalname))
    }
})

const images = multer({ storage: imagesStorage }).array('image');

router.post('/createCategory', images, createCategory);
router.get('/getCategory/:id', getCategory);
router.get('/getAllCategories', getAllCategories);

router.put('/updateCategory/:id', images, updateCategory);

router.delete('/deleteCategory/:id', deleteCategory);

export { router as CategoryRoute };
