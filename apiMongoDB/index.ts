import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import App from "./Services/ExpressApp";
import DbCon from "./Services/Database";
import { PORT } from "./config"

const StartServer = async () => {
    const app = express();
    await DbCon();
    await App(app);

    app.listen(PORT, () => {
        console.log(`Connected on port ${PORT}!`);
    })
}

StartServer();