import express, { Application } from 'express'
import { CategoryRoute } from '../Routes/CategoryRoute';
import { ProductRoute } from '../Routes/ProductRoute';
import { UserRoute } from '../Routes/UserRoute';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use('/assets', express.static('assets'))
    app.use('/category', CategoryRoute)
    app.use('/product', ProductRoute)
    app.use('/user', UserRoute)

    return app;
}
