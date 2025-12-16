import { Router } from "express";
import { body } from "express-validator";
import {
  createSnippet,
  deleteSnippet,
  forkSnippet,
  getSnippet,
  listSnippets,
  previewSnippet,
  updateSnippet,
} from "../controllers/snippetController.js";
import { auth, optionalAuth } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();

router.get("/", optionalAuth, listSnippets);
router.get("/:id", optionalAuth, getSnippet);
router.get("/:id/preview", previewSnippet);

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("code").notEmpty().withMessage("Code required"),
    body("language").notEmpty().withMessage("Language required"),
  ],
  validate,
  createSnippet
);

router.put(
  "/:id",
  auth,
  [
    body("title").optional().isString(),
    body("code").optional().isString(),
    body("language").optional().isString(),
    body("tags").optional().isArray(),
    body("isPublic").optional().isBoolean(),
  ],
  validate,
  updateSnippet
);

router.delete("/:id", auth, deleteSnippet);
router.post("/:id/fork", auth, forkSnippet);

export default router;

