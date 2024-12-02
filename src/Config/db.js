import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (error) {
        console.error("MONGODB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

export default dbConnect;
