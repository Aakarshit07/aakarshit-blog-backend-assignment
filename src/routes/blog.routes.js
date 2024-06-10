import { Router } from "express";
import {
    getAllBlogs,
    getBlogDetails,
    createBlog,
    deleteBlog,
    updateBlog,
    getFilteredBlogs
} from "../controller/blog.controller.js";
import { veriftJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Secure Routes
router.use(veriftJWT);

router.route("/")
    .get(getAllBlogs)
    .post(upload.single('coverImage'), createBlog);

router.route("/filter")
    .get(getFilteredBlogs);

router.route("/:id")
    .get(getBlogDetails)
    .put(upload.single('coverImage'), updateBlog)
    .delete(deleteBlog);

export default router;