import { userLogin, userRegistration, getUserProfile, updateUserProfile } from "../Controllers/UserController";
import express from "express";

const router = express.Router();

router.post("/registerUser", userRegistration);
router.post("/loginUser", userLogin);
router.get("/profile", getUserProfile);
router.put("/updateProfile", updateUserProfile);
export { router as UserRoute };
