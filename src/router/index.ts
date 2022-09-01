import express from "express";
import user_router from "./user";
import post_router from "./post";
import { root_path, login } from "../handler/index";
import { create } from "../handler/user";
import { find_key, autorization, without_sensitive } from "../middleware/user";

const router = express.Router();

router.all("*", [find_key]);
router.get("/", root_path);
router.post("/login", login);
router.post("/register", without_sensitive, create);
router.all("/api/*", [autorization]);
router.use("/api/user", user_router);
router.use("/api/post", post_router);

export default router;
