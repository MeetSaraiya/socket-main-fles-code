const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

const users = new Set();
let mgsList = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (username) => {
        if (!username || typeof username !== "string") {
            socket.emit("errorOccurred", { type: "INVALID_USERNAME", message: "Invalid username" });
            return;
        }

        const normalizedUsername = username.trim().toLowerCase();
        if (users.has(normalizedUsername)) {
            socket.emit("errorOccurred", { type: "USERNAME_TAKEN", message: "Username already taken" });
            return;
        }

        console.log(`${normalizedUsername} has joined the chat`);

        users.add(normalizedUsername);
        socket.userName = normalizedUsername;

        io.emit("userJoined", normalizedUsername);
        io.emit("userList", Array.from(users));
        io.emit("messageList",mgsList)

    });

    socket.on("disconnect", () => {
        if (!socket.userName) {
            console.log("A user disconnected before joining");
            return;
        }

        console.log(`User ${socket.userName} has disconnected`);
        if (users.delete(socket.userName)) {
            io.emit("userRemoved", socket.userName);
        }
        io.emit("userList", Array.from(users));
        io.emit("messageList",mgsList)

    });

    socket.on("newMessage", (message) => {
        console.log("message",message)
        if (!message || typeof message !== "string") {
            socket.emit("errorOccurred", { type: "INVALID_MESSAGE", message: "Message must be a string" });
            return;
        }
        mgsList = [...mgsList,{message : message , sender: socket.userName}];
        io.emit("messageList",mgsList)
        io.emit("userList", Array.from(users));
        // io.emit("newMessage", message);
    });
});

server.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
