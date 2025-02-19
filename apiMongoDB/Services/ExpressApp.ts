import express, { Application } from 'express';
import path from 'path';
import { CategoryRoute } from '../Routes/CategoryRoute';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/assets', express.static('assets'));
    app.use('/category', CategoryRoute);
}