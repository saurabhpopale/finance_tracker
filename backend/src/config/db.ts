import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error("CRITICAL: MONGODB_URI environment variable is missing.");
            process.exit(1);
        }

        const connection = await mongoose.connect(mongoUri);

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;