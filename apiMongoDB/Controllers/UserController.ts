import { Request, Response } from "express";
import { UserAddressParams, userLoginParams, userModelParams, } from "../dto/User";
import { USERLOG } from "../Models/UserModel";

export const userRegistration = async (
    req: Request<{}, any, userModelParams>,
    res: Response
): Promise<void> => {
    const { firstName, lastName, email, mobileNo, password, confirmPassword } =
        req.body;

    const userRegistration = new USERLOG({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
        confirmPassword,
    });
    console.log("req.body:", userRegistration);

    try {
        // Check if email already exists
        const checkEmail = await USERLOG.findOne({ email });
        const checkMobile = await USERLOG.findOne({ mobileNo });
        console.log("checkEmail result:", checkEmail);
        if (checkEmail) {
            console.log("Email duplicate detected, exiting...");
            res.status(402).json({ message: "Email Already in use by another User" });
            return;
        }
        if (checkMobile) {
            console.log("Mobile duplicate detected, exiting...");
            res
                .status(401)
                .json({ message: "Mobile Already in use by another User" });
            return;
        }
        if (password !== confirmPassword) {
            // Check if passwords match
            console.log("Passwords do not match, exiting...");
            res.status(403).json({ message: "Password does not match" });
            return;
        }

        // Save the user and send success response
        console.log("Saving user to database...");
        await userRegistration.save();
        console.log("User saved successfully!");
        res.status(200).json({ message: "Registration created successfully" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: `Registration failed: ${err}` });
    }
};

export const userLogin = async (
    req: Request<{}, any, userLoginParams>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log("req.body:", email, password);
        const user = await USERLOG.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Email a valid username" });
            return;
        }
        if (user.password !== password) {
            res.status(403).json({ message: "Enter a valid password" });
        }
        const token = user._id;
        console.log("user token", token);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: { err } });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"
        if (!userId) {
            res.status(401).json({ message: "No authorization token provided" });
            return;
        }

        const user = await USERLOG.findById(userId).select("-password -confirmPassword -userAddressInfo -orders"); // Exclude sensitive fields
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ 
            message: "User profile fetched successfully",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNo: user.mobileNo,
            }
        });
    } catch (err) {
        console.error("Error fetching user profile:", err);
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"
        if (!userId) {
            res.status(401).json({ message: "No authorization token provided" });
            return;
        }

        const { firstName, lastName, email, mobileNo } = req.body;

        const user = await USERLOG.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (mobileNo) user.mobileNo = mobileNo;

        // Check for duplicate email or mobile number (excluding current user)
        const existingEmail = await USERLOG.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) {
            res.status(400).json({ message: "Email already in use by another user" });
            return;
        }

        const existingMobile = await USERLOG.findOne({ mobileNo, _id: { $ne: userId } });
        if (existingMobile) {
            res.status(400).json({ message: "Mobile number already in use by another user" });
            return;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating profile:", err);
    }
};