"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const RoomController = __importStar(require("./controllers/roomController"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
const PORT = 3000;
mongoose_1.default
    .connect("mongodb+srv://quard:Screaper228@cluster0.zyg0fil.mongodb.net/?retryWrites=true&w=majority", {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
})
    .then(() => {
    console.log("BD Ok");
})
    .catch((err) => {
    console.log("BD BAD", err);
});
exports.io.on("connection", (socket) => {
    socket.on("createRoom", (data) => {
        socket.join(data.roomId);
        exports.io.to(data.roomId).emit("getClickq", data);
    });
    socket.on("joinRoom", (data) => {
        socket.join(data);
    });
    socket.on("leaveRoom", (room) => {
        console.log("leave", room.userName);
        socket.leave(room.roomId);
    });
    socket.on("userLeft", (data) => { });
    socket.on("answersSent", (data) => {
        exports.io.to(data.roomId).emit("getAnswer", data);
    });
    socket.on("drawing", (data) => {
        exports.io.to(data.roomId).emit("getDraw", data);
    });
    socket.on("drawing2", (data) => {
        exports.io.to(data.roomId).emit("getDraw2", data);
    });
    socket.on("allUsersGuessed", (data) => {
        exports.io.to(data.roomId).emit("getAllUsersGuessed");
    });
    socket.on("nextUserCall", (data) => {
        exports.io.to(data.roomId).emit("getNextUserCall", data);
    });
    socket.on("wordChoosed", (data) => {
        exports.io.to(data.roomId).emit("getWordChoosed", data.choosedWord);
    });
    socket.on("correctAnswer", (data) => {
        exports.io.to(data.roomId).emit("getCorrectAnswer");
    });
    socket.on("skipRound", (data) => {
        exports.io.to(data.roomId).emit("getSkipRound");
    });
    socket.on("click", (data) => {
        exports.io.to(data.roomId).emit("getClick", data);
    });
    socket.on("123", (data) => {
        exports.io.to(data.roomId).emit("321", data);
    });
    socket.on("startGame", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const getRandomWords = (count) => __awaiter(void 0, void 0, void 0, function* () {
            const randomWords = [];
            const words = yield data.words;
            while (randomWords.length < count) {
                const randomIndex = yield Math.floor(Math.random() * words.length);
                const randomWord = yield words[randomIndex];
                if (!randomWords.includes(randomWord)) {
                    randomWords.push(randomWord);
                }
            }
            return randomWords;
        });
        const chosenWords = yield getRandomWords(2);
        exports.io.to(data.roomId).emit("gameStarted");
        exports.io.to(data.roomId).emit("gameWords", chosenWords);
    }));
    socket.on("sentWord", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("In");
        const getRandomWords = (count) => __awaiter(void 0, void 0, void 0, function* () {
            const randomWords = [];
            const words = yield data.words;
            while (randomWords.length < count) {
                const randomIndex = yield Math.floor(Math.random() * words.length);
                const randomWord = yield words[randomIndex];
                if (!randomWords.includes(randomWord)) {
                    yield randomWords.push(randomWord);
                }
            }
            return randomWords;
        });
        const chosenWords = yield getRandomWords(2);
        console.log("отправка out", chosenWords);
        exports.io.to(data.roomId).emit("getWord", chosenWords);
    }));
    socket.on("guessWord", (guess) => {
        // Проверяем, совпадает ли попытка угадывания с одним из выбранных слов
    });
    socket.on("usersNotGuessed", (roomId) => {
        console.log("NOT GUESSED", roomId);
        exports.io.to(roomId).emit("getUsersNotGuessed");
    });
    socket.on("inactiveOver", (roomId) => {
        exports.io.to(roomId).emit("getInactiveOver");
    });
    socket.on("usersNotGuessedTimer", (roomId) => {
        exports.io.to(roomId).emit("getUsersNotGuessedTimer");
    });
    socket.on("oneUserGuessed", ({ roomId, roomUsers }) => {
        exports.io.to(roomId).emit("getOneUserGuessed", { roomUsers });
    });
    socket.on("allUsersGuessed2", ({ roomId, roomUsers }) => {
        console.log("в 2 все юзеры угадали");
        exports.io.to(roomId).emit("getAllUsersGuessed2", { roomUsers });
    });
});
// Функция для запуска таймера  интервала
app.post("/createRoom", RoomController.createRoom);
app.get("/getRoomData", RoomController.getRoomInfo);
app.post("/joinRoom", RoomController.joinRoom);
app.post("/leaveRoom", RoomController.leaveRoom);
app.post("/test", RoomController.test);
app.post("/yourTurn", RoomController.intervalTimer);
app.post("/inactiveTimer", RoomController.inactiveTimer);
app.post("/roundTimer", RoomController.roundTimer);
app.post("/usersNotGuessed", RoomController.usersNotGuessedTimer);
app.post("/allUsersGuessed", RoomController.allUsersGuessed);
app.post("/wordChoosed", RoomController.wordChoosed);
app.post("/startNewGame", RoomController.handleNextUserCall);
// app.post("/startTimer", RoomController.startTimer);
app.post("/userGuessed", RoomController.userGuessedCorrect);
app.post("/isUserInLobby", RoomController.isUserInGame);
app.post("/updateUserState", RoomController.updateUserState);
app.post("/ping", RoomController.Ping);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
