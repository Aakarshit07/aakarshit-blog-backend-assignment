# Vizmo Blog Assignment
- Vizmo Blog Assignment is a full-featured blog application built using Node.js, Express, MongoDB, and other modern web technologies. It provides secure user authentication, blog creation, updating, deletion, and filtering functionalities, along with cloud storage for images.

## 📦 Technologies

```Node.js```
```Express```
```MongoDB```
```Mongoose```
```JWT```
```Cloudinary```
```bcrypt```
```Multer```

## ✨ Features
- Here's what Vizmo Blog Assignment offers:

- User Authentication: Secure login and registration.
- Blog Management: Create, update, and delete blogs.
- Image Upload: Upload and manage images using Cloudinary.
- Filtering: Filter blogs based on title and author.
- Security: Protected routes with JWT authentication.
- Middleware: Use of custom middleware for authentication and file uploads.



## 🚀 Getting Started
### Setup Instructions

1. Clone the Project
    ```
    git clone https://github.com/Aakarshit07/aakarshit-blog-backend-assignment
    
    ```


2. Move into the directory
    ```
    cd aakarshit-blog-backend-assignment
    ```

3. Install dependencies
    ```
        npm install bcrypt cloudinary cookie-parser cors dotenv express jsonwebtoken mongoose multer
        
    ```
    ```
    npm install -D nodemon prettier
    ```

4. Set up environment variables: Create a .env  
- file in the root directory with the following 
- contents:
    plaintext
    ```
    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
    DB_NAME=vizmo-blog
    ACCESS_TOKEN_SECRET=youraccesstokensecret
    ACCESS_TOKEN_EXPIRY=1h
    REFRESH_TOKEN_SECRET=yourrefreshtokensecret
    REFRESH_TOKEN_EXPIRY=7d
    CLOUDINARY_CLOUD_NAME=yourcloudname
    CLOUDINARY_API_KEY=yourapikey
    CLOUDINARY_API_SECRET=yourapisecret
    CORS_ORIGIN=*
    ```
5. Run the server
    ```
    npm run dev
    ```


## API Endpoints
### User Routes

- POST /api/v1/users/register: Register a new user.
    ```
    *Request Body* as JSON

    {
        "fullName": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }
    ```
- POST /api/v1/users/login: Log in a user.
    ```
    *Request Body* as JSON
    
    {
        "email": "john@example.com",
        "password": "password123"
    }
    ```

## Blog Routes
- GET /api/v1/blogs/: Get all blogs.
- POST /api/v1/blogs/: Create a new blog.
    ```
    *Request Body* as JSON

    {
        "title": "My First Blog",
        "content": "This is the content of my first blog.",
        "coverImage": <file>
    }
    ```



- GET /api/v1/blogs/filter?title=<Blog-Title>&author=<Full-Name>: Get filtered blogs by title and author.
- GET /api/v1/blogs/:id Get blog details by ID.
- PUT /api/v1/blogs/:id Update a blog by ID.
   ```
   *Request Body* as JSON

    {
        "title": "Updated Blog Title",
        "content": "Updated blog content.",
        "coverImage": <file>
    }

   ```


- DELETE /api/v1/blogs/:id Delete a blog by ID.