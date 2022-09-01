import express from "express";
import { create, get_many } from "../handler/post";

const router = express.Router();

/**
 * "path" | ["middleware"] | "handler"
 */
router.post("/", create);
router.get("/", get_many);

export default router;
