import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken() // we give this access token to user as its expiry is short and refresher often.
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

//Signup / Register User
const registerUser = asyncHandler(async(req, res) => {
    const {fullName, email, password} = req.body;

    if(
        [fullName, email, password].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required");
    }

    //Check user already exists in DB or not
    const existedUser = await User.findOne({email});

    if(existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        fullName, 
        email,
        password,
        refreshToken: "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registring user");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            createdUser, 
            "User Registered successfully"
        )
    )
});

//Login User
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true, 
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser,
                accessToken, 
                refreshToken, 
            },
            "User logged in successfully"
        )
    )
});




export {
    registerUser, 
    loginUser
}