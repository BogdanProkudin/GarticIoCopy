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
  socket.on("guessWord", (guess) => {
    // Проверяем, совпадает ли попытка угадывания с одним из выбранных слов
  });
});

app.post("/createRoom", RoomController.createRoom);
app.get("/getRoomData", RoomController.getRoomInfo);
app.post("/joinRoom", RoomController.joinRoom);
app.post("/leaveRoom", RoomController.leaveRoom);
app.post("/test", RoomController.test);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
