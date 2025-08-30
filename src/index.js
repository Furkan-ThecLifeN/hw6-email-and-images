import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { initMongoConnection } from "./db/initMongoConnection.js";
import contactsRouter from "./routes/contacts.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);

// Not found & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await initMongoConnection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();