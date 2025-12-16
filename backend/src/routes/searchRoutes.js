import { Router } from "express";
import { searchSnippets } from "../controllers/searchController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, searchSnippets);

export default router;

