import { DB_NAME } from "../utils/constant.js";
import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`Mongodb connected DB host !! ${connectInstance.connection.host}`)
    } catch (error) {
        console.log(`Mongodb disconnected ${error?.message}`)     
    }
}