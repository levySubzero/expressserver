const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const questionJsonData = {
    question: "Is triviabillionia a cool game?",
    answers: [
        { id: 1, answer: "Kinda" },
        { id: 2, answer: "Definitely" },
        { id: 3, answer: "No" }
    ]
}

let correctId = 2;

let stats = {
    "1": 15,
    "2": 65,
    "3": 10
}

let stat = [
    {'stateNum': 15,
    'stateTotal': 90,
    'correctStatus': false
    },

    {'stateNum': 65,
    'stateTotal': 90,
    'correctStatus': true
    },

    {'stateNum': 10,
    'stateTotal': 90,
    'correctStatus': false
    }
]


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
    });

    socket.on("answer", (data) => {
        console.log(`AnswerID: ${data}`);
        if (data === correctId) {
            console.log('Answer correct');
            socket.emit("correct", correctId, stats)
        } else {
            console.log('Answer Incorrect');   
            socket.emit("correct", correctId, stats)
        }
        socket.broadcast.emit("receive_message", data)
    });

    socket.on('life', function (callback) {
        console.log(`need life`);
        callback(true);
    });

    socket.on("joined", (data) => {
        socket.emit("question", questionJsonData)
        console.log(`q sent: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log("Server is Running");
});