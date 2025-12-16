import { Router } from "express";
import { body, param } from "express-validator";
import {
  addSnippetToCollection,
  createCollection,
  getCollections,
  removeSnippetFromCollection,
} from "../controllers/collectionController.js";
import { auth } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();

router.get("/", auth, getCollections);

router.post(
  "/",
  auth,
  [body("name").notEmpty().withMessage("Name is required")],
  validate,
  createCollection
);

router.post(
  "/:collectionId/snippets",
  auth,
  [
    param("collectionId").isMongoId(),
    body("snippetId").isMongoId().withMessage("snippetId required"),
  ],
  validate,
  addSnippetToCollection
);

router.delete(
  "/:collectionId/snippets/:snippetId",
  auth,
  [param("collectionId").isMongoId(), param("snippetId").isMongoId()],
  validate,
  removeSnippetFromCollection
);

export default router;

