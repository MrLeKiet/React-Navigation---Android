import { userLogin, userRegistration } from "../Controllers/UserController";
import express from "express";

const router = express.Router();

router.post("/registerUser", userRegistration);
router.post("/loginUser", userLogin);

export { router as UserRoute };
