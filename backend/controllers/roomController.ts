import { RoomModel } from "../models/roomModel";
import { Request, Response, json } from "express";
import { io } from "../server";
export const createRoom = async (req: Request, res: Response) => {
  try {
    // Получаем данные для создания комнаты из запроса

    const { host, points, players, thema, usersInfo, roomId } = req.body;

    const isUserCreateRoom = await RoomModel.findOne({ host: host });

    if (isUserCreateRoom) {
      await RoomModel.deleteMany({ host: host });
    }
    // Создаем новую комнату в базе данных
    const newRoom = new RoomModel({
      host,
      points,
      players,
      thema,
      usersInfo,
      roomId,
    });

    // Сохраняем созданную комнату в базе данных
    await newRoom.save();
    console.log("sucessesfull created room ");

    res.status(201).json({
      message: "Room created successfully",
      data: { roomId, host, players, thema, usersInfo, points },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating room" });
  }
};

export const getRoomInfo = async (req: Request, res: Response) => {
  try {
    const roomId = req.query.q;
    const roomData = await RoomModel.find({ roomId: roomId });
    res.status(201).json(roomData);
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(500).json({ message: "Error getting room" });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, userInfo } = req.body;
    userInfo.isInGame = true;
    const roomData = await RoomModel.findOneAndUpdate(
      { roomId: roomId },
      {
        $push: {
          usersInfo: userInfo,
        },
      },
      { new: true }
    );

    io.to(roomId).emit("userJoined", roomData);
    return res.status(200).json({ message: "Successfully joined the room" });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Error joining room" });
  }
};

export const leaveRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, userName } = req.body;
    const roomData = await RoomModel.findOneAndUpdate(
      { roomId: roomId },
      {
        $pull: {
          usersInfo: { userName: userName },
        },
      },
      { new: true }
    );
    console.log("user Leaved");

    io.to(roomId).emit("userLeaved", roomData);
    return res
      .status(200)
      .json({ message: "Successfully left the room", roomData });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
};
export const test = async (req: Request, res: Response) => {
  try {
    console.log("test works user leavs");
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
};
