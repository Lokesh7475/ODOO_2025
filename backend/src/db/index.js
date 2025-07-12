import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB  = async () => {
    console.log(DB_NAME)
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGO DB connected DB HOST : ${connectionInstance}`)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
} 

export default connectDB;