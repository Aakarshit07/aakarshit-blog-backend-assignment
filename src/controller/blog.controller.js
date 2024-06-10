import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

//Created Blog

const createBlog = asyncHandler(async(req, res) => {
    const { title, content } = req.body;
    if(
        [title, content].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required");
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.file?.path;
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    const blog = await Blog.create({
        title,
        content,
        author: req.user?._id,
        coverImage: coverImage?.url || "",
    })

    if(!blog) {
        throw new ApiError(500, "Something went wrong while creating blog");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            blog,
            "Blog created successfully"
        )
    )

});

const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate('author', 'fullName email');
    return res.status(200).json(new ApiResponse(200, blogs, "Fetched all blogs successfully"));
});

const updateCoverImage = asyncHandler(async(req, res) => {
    
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing"); 
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error While uploading on cover Image");
    }

    const blog = await Blog.findByIdAndUpdate(
        req.blog?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            blog, 
            "Cover Image updated successfully"
        )
    )
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const { title, content } = req.body;

    if ([title, content].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const blog = await Blog.findByIdAndUpdate(
        id,
        { title, content, author: req?.user._id },
        { new: true }
    );

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

const getFilteredBlogs = asyncHandler(async (req, res) => {
    const { title, author } = req.query;
    const filter = {};

    if (title) {
        filter.title = new RegExp(title, 'i'); // case-insensitive regex search
    }

    if (author) {
        const authorUser = await User.findOne({ fullName: new RegExp(author, 'i') });
        if (authorUser) {
            filter.author = authorUser._id;
        } else {
            return res.status(200).json(new ApiResponse(200, [], "No blogs found with the specified author"));
        }
    }

    const blogs = await Blog.find(filter).populate('author', 'fullName email');
    return res.status(200).json(new ApiResponse(200, blogs, "Fetched filtered blogs successfully"));
});

const getBlogDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate('author', 'fullName email');
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    return res.status(200).json(new ApiResponse(200, blog, "Fetched blog details successfully"));
});

export {
    createBlog,
    updateCoverImage,
    getBlogDetails,
    getAllBlogs,
    deleteBlog,
    updateBlog,
    getFilteredBlogs
}
