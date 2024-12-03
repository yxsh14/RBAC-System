import express from "express";
import dotenv from "dotenv";
import dbConnect from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js"
import userRoutes from "./Routes/userRoutes.js";
dotenv.config();
const app = express();


// Connect with Database
dbConnect();

// Middleware
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Start the server 
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log("Server is running at port: ", PORT);

})
