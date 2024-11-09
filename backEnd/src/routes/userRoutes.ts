import { Router } from "express";
import {
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
} from "../controllers/user-controllers.js";
import { verifyToken } from "../utils/token-managar.js";

const userRoutes = Router();

// userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", userSignup);
userRoutes.post("/login", userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;
