import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions))

const __dirname = path.resolve()

import authRoute from "../routes/auth.route.js"
import messageRoute from "../routes/message.route.js"

app.use("/api/auth",authRoute)
app.use("/api/messages",messageRoute)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
})

export {app}