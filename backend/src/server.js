import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import { server } from "../utils/socket.js"
const port = process.env.PORT
import { connectDB } from "../db/index.js"

connectDB()
.then(() => {
    server.listen(port, function(){
        console.log(`Server is running on port ${port}`)
    })
})
.catch(() => {
    console.log(`Server crashed !!!`)
})