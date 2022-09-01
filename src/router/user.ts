import express from "express";
import {get_many, get_one } from "../handler/user";
import { without_sensitive } from "../middleware/user";

const router = express.Router();

/**
 * "path" | ["middleware"] | "handler"
 */
router.get("/:id", without_sensitive, get_one);
router.get("/", without_sensitive, get_many);

export default router;
