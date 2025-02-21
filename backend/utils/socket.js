import {Server} from "socket.io"
import http from "http"
import {app} from "../src/app.js"

const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173"
    }
})

const userSocketMap = {}
export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId]
}   

//used to store online users

io.on("connection", (socket) => {

 const userId = socket.handshake.query.userId
 if(userId) userSocketMap[userId] = socket.id

 io.emit("getOnlineUsers", Object.keys(userSocketMap))
 socket.on("disconnect", () => {
     delete userSocketMap[userId]
     io.emit("getOnlineUsers", Object.keys(userSocketMap))
 })
})

export {io, server}