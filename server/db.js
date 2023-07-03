import mongoose from "mongoose";
export const connectDB =  async () =>{
    try {
        mongoose.set("strictQuery",false)
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }
}