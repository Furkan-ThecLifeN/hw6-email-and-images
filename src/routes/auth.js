import express from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController, // Yeni eklenen
  resetPasswordController, // Yeni eklenen
} from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema, // Yeni eklenen
  resetPasswordSchema, // Yeni eklenen
} from "../schemas/authSchema.js";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController));
authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController));
authRouter.post("/refresh", ctrlWrapper(refreshController));
authRouter.post("/logout", ctrlWrapper(logoutController));
authRouter.post("/send-reset-email", validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController)); // Yeni rota
authRouter.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController)); // Yeni rota

export default authRouter;