import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsController.js";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactSchema.js";
import { authenticate } from "../middlewares/authenticate.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js"; // Yeni eklenen

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getAllContacts));
router.get("/:id", isValidId, ctrlWrapper(getContactById));
router.post(
  "/",
  uploadMiddleware.single("photo"), // Yeni eklenen middleware
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);
router.patch(
  "/:id",
  isValidId,
  uploadMiddleware.single("photo"), // Yeni eklenen middleware
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);
router.delete("/:id", isValidId, ctrlWrapper(deleteContact));

export default router;