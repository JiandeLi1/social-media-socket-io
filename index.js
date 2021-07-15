const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});
let users = []
const addUser = (userId, socketId) => {
    //Using .some to find it, is the user in the users list or not, if not, pushing userId and socketId to the users list
    !users.some(user => user.userId === userId) && users.push({userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user=>user.socketId!==socketId)
}

const getUser = (userId) => {
    return users.find(user=>user.userId === userId)
}

io.on("connection", (socket) => {
    console.log("a user connected!")
    //Emiting a message to client side
    //io.emit("welcome","Hello, every! welcome to here!")
    
    //take userId and socketId from user

    //.emit send event to server/client
    //.on take event from server/client
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })


    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})