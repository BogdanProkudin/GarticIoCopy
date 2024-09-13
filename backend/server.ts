import express from "express";
import http from "http";
import mongoose from "mongoose";
import * as RoomController from "./controllers/roomController";
import cors from "cors";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "http://localhost:3000"] },
});
app.use(cors());
app.use(express.json());
const PORT = 3000;
mongoose
  .connect(
    "mongodb+srv://quard:Screaper228@cluster0.zyg0fil.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("BD Ok");
  })
  .catch((err) => {
    console.log("BD BAD", err);
  });

io.on("connection", (socket) => {
  socket.on("createRoom", (data) => {
    socket.join(data.roomId);

    io.to(data.roomId).emit("getClickq", data);
  });
  socket.on("joinRoom", (data) => {
    socket.join(data);
  });
  socket.on("leaveRoom", (room) => {
    console.log("leave", room.userName);

    socket.leave(room.roomId);
  });
  socket.on("answersSent", (data) => {
    io.to(data.roomId).emit("getAnswer", data);
  });
  socket.on("drawing", (data) => {
    io.to(data.roomId).emit("getDraw", data);
  });
  socket.on("drawing2", (data) => {
    io.to(data.roomId).emit("getDraw2", data);
  });
  socket.on("allUsersGuessed", (data) => {
    io.to(data.roomId).emit("getAllUsersGuessed");
  });
  socket.on("nextUserCall", (data) => {
    io.to(data.roomId).emit("getNextUserCall", data);
  });
  socket.on("wordChoosed", (data) => {
    io.to(data.roomId).emit("getWordChoosed", data.choosedWord);
  });
  socket.on("correctAnswer", (data) => {
    io.to(data.roomId).emit("getCorrectAnswer");
  });
  socket.on("skipRound", (data) => {
    io.to(data.roomId).emit("getSkipRound");
  });

  socket.on("click", (data) => {
    io.to(data.roomId).emit("getClick", data);
  });
  socket.on("123", (data) => {
    io.to(data.roomId).emit("321", data);
  });
  socket.on("startGame", (data) => {
    const getRandomWords = (count: any) => {
      const randomWords: any = [];
      const words = data.words;
      while (randomWords.length < count) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        if (!randomWords.includes(randomWord)) {
          randomWords.push(randomWord);
        }
      }
      return randomWords;
    };
    const chosenWords = getRandomWords(2);
    io.to(data.roomId).emit("gameStarted");
    io.to(data.roomId).emit("gameWords", chosenWords);
  });
  socket.on("sentWord", async (data) => {
    console.log("In");

    const getRandomWords = async (count: any) => {
      const randomWords: any = [];
      const words = await data.words;
      while (randomWords.length < count) {
        const randomIndex = await Math.floor(Math.random() * words.length);
        const randomWord = await words[randomIndex];
        if (!randomWords.includes(randomWord)) {
          await randomWords.push(randomWord);
        }
      }
      return randomWords;
    };
    const chosenWords = await getRandomWords(2);
    console.log("отправка out", chosenWords);

    io.to(data.roomId).emit("getWord", chosenWords);
  });
  socket.on("guessWord", (guess) => {
    // Проверяем, совпадает ли попытка угадывания с одним из выбранных слов
  });
  socket.on("usersNotGuessed", (roomId) => {
    console.log("NOT GUESSED", roomId);

    io.to(roomId).emit("getUsersNotGuessed");
  });
  socket.on("inactiveOver", (roomId) => {
    io.to(roomId).emit("getInactiveOver");
  });
  socket.on("usersNotGuessedTimer", (roomId) => {
    io.to(roomId).emit("getUsersNotGuessedTimer");
  });
  socket.on("oneUserGuessed", ({ roomId, roomUsers }) => {
    io.to(roomId).emit("getOneUserGuessed", { roomUsers });
  });
  socket.on("allUsersGuessed2", ({ roomId, roomUsers }) => {
    console.log("в 2 все юзеры угадали");

    io.to(roomId).emit("getAllUsersGuessed2", { roomUsers });
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

app.post("/updateUserState", RoomController.updateUserState);
app.post("/ping", RoomController.Ping);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
