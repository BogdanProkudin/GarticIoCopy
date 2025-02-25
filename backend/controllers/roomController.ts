import { RoomModel } from "../models/roomModel";
import { Request, Response, json } from "express";
import { io } from "../server";
const roomStates: any = {};
const timers: any = {};
const getNextActiveUser = (users: any) => {
  // Фильтруем пользователей с минимальным activeCount
  const minActiveCount = Math.min(
    ...users.map((user: any) => user.activeCount || 0)
  );
  const nextActiveUsers = users.filter(
    (user: any) => (user.activeCount || 0) === minActiveCount
  );

  // Если есть несколько, выбираем первого
  return nextActiveUsers[0];
};

const updateUserActivity = (users: any, nextActiveUser: any) => {
  return users.map((user: any) => {
    console.log(user, "next", nextActiveUser);

    return {
      ...user,
      isActive: user.userName === nextActiveUser.userName,
      activeCount:
        user.userName === nextActiveUser.userName
          ? (user.activeCount || 0) + 1 // Увеличиваем счётчик активности
          : user.activeCount || 0,
    };
  });
};

const isGameWon = (roomUsers: any, maxGamePoints: number) => {
  return roomUsers.some((user: any) => user.userPoints >= maxGamePoints);
};

const handleGameWin = async (
  roomId: string,
  roomUsers: any,
  maxGamePoints: number
) => {
  const listWinners = roomUsers.filter((user: any) =>
    roomUsers.length > 3 ? user.userPoints >= maxGamePoints : user.userPoints
  );

  const winners = listWinners
    .sort((a: any, b: any) => b.userPoints - a.userPoints)
    .slice(0, 3);
  await RoomModel.findOneAndUpdate(
    { roomId: roomId },
    { $set: { gameWinners: winners } },
    { new: true }
  );
  return winners;

  // Сохраняем состояние победы в состоянии комнаты
};

export const handleNextUserCall = async (
  req: Request | null,
  res: Response | null,
  roomId: any
) => {
  try {
    const roomFirstId = await req?.body.roomId;
    const roomData = await RoomModel.findOne({
      roomId: roomFirstId ? roomFirstId : roomId,
    });
    console.log("roomddata found 20002 ", roomData);

    if (!roomData) {
      return { message: "Room data not found. ERROR" };
    }

    if (roomData.isGameStarted === false) {
      await RoomModel.findOneAndUpdate(
        { roomId: roomFirstId ? roomFirstId : roomId },
        { isGameStarted: true },
        { new: true }
      );
    }

    const users = await roomData?.usersInfo.filter(
      (user: any) => !user.isUserLeave
    );
    const maxGamePoints = await roomData?.points;

    if (!users || !maxGamePoints) {
      return;
    }

    // Выбираем следующего активного пользователя
    const nextActiveUser = await getNextActiveUser(users);

    // Обновляем активность и счётчики
    const updatedUsers = await updateUserActivity(users, nextActiveUser);
    console.log(updatedUsers);

    await RoomModel.findOneAndUpdate(
      { roomId: roomFirstId ? roomFirstId : roomId },
      { $set: { activeUser: nextActiveUser, usersInfo: updatedUsers } },
      { new: true }
    );

    if (isGameWon(users, maxGamePoints)) {
      console.log("game won");

      const gameWinners = await handleGameWin(
        roomId.length !== 6 ? roomFirstId : roomId,
        users,
        maxGamePoints
      );

      io.to(roomId.length !== 6 ? roomFirstId : roomId).emit("gameWon", {
        winners: gameWinners,
      });
    } else {
      const updatedRoom = await RoomModel.findOne({ roomId });
      const remainingUsers = await updatedRoom?.usersInfo.filter(
        (user: any) => !user.isUserLeave
      );
      console.log(remainingUsers?.length, "LENGTH REMAIN Users12", updatedRoom);

      await io
        .to(roomId.length !== 6 ? roomFirstId : roomId)
        .emit("getNextUserCall", {
          activeUser: nextActiveUser,
          users: remainingUsers
            ? remainingUsers
            : updatedUsers.filter((user: any) => !user.isUserLeave),
          test: "test",
        });
    }

    return res ? res?.status(200).json("alles goed") : "";
  } catch (err) {
    console.log("ERROR WHEN UPDATING NEXT ACTIVE USER", err);
  }
};

export const isUserInGame = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("USERID", userId, "BOD", req.body);

    const isPlayerFound = await RoomModel.find(
      {
        usersInfo: {
          $elemMatch: { userId: userId, isUserLeave: undefined },
        },
      },
      { maxTimeMS: 10000 }
    );
    console.log("IS PLAYER FOUND", isPlayerFound.length, userId);
    if (isPlayerFound.length >= 1 && userId !== null) {
      console.log("REDIRECT TO MAIN PAGE SECOND ACTIVE GAME", userId);
      return res.status(200).json({ message: "You are already in the room" });
    }
    return res.status(200).json({ message: "User is not in the game" });
  } catch (error: any) {
    if (error.name === "MongoTimeoutError") {
      return res.status(408).json({ message: "Request timeout" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    // Получаем данные для создания комнаты из запроса

    const { host, points, players, thema, usersInfo, roomId } = req.body;
    const isPlayerFound = await RoomModel.find({
      usersInfo: {
        $elemMatch: { userId: host.hostId, isUserLeave: undefined },
      },
    });
    console.log("IS PLAYER FOUND", isPlayerFound.length, host.hostId);
    if (isPlayerFound.length >= 1 && host.hostId !== null) {
      console.log("REDIRECT TO MAIN PAGE SECOND ACTIVE GAME", host.hostId);
      return res.status(200).json({ message: "You are already in the room" });
    }

    const isUserCreateRoom = await RoomModel.findOne({
      "host.hostId": host.hostId,
    });

    // if (isUserCreateRoom) {
    //   await RoomModel.deleteMany({ host: host });
    // }
    // Создаем новую комнату в базе данных
    const newRoom = new RoomModel({
      host: { hostName: host.hostName, hostId: host.hostId },
      points,
      players,
      thema,
      usersInfo,
      roomId,
      skippedRoundsinLine: 0,
      usersLeftCount: 0,
      isGameStarted: false,
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
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    // Находим комнату
    const roomData = await RoomModel.findOne({ roomId });

    if (!roomData) {
      return res.status(404).json({ message: "Room does not exist" });
    }

    // Фильтруем только активных пользователей (не покинули комнату)
    const filteredUsers = await roomData.usersInfo.filter(
      (user: any) => !user.isUserLeave
    );

    // Формируем ответ без изменения базы данных
    const responseData = {
      roomId: roomData.roomId,
      usersInfo: filteredUsers,
      host: roomData.host,
      points: roomData.points,
      thema: roomData.thema,
      players: roomData.players,
      isGameStarted: roomData.isGameStarted,
      usersLeftCount: roomData.usersLeftCount,
      gameWinners: roomData.gameWinners,
      usersGuessedList: roomData.usersGuessedList,
      skippedRoundsinLine: roomData.skippedRoundsinLine,
    };

    return res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error getting room:", error);
    return res
      .status(500)
      .json({ message: "Error getting room", error: error.message });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, userInfo } = req.body;

    if (!roomId || !userInfo || !userInfo.userId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Проверяем, есть ли пользователь уже в комнате
    const existingRoom = await RoomModel.findOne({
      roomId,
      usersInfo: {
        $elemMatch: { userId: userInfo.userId, isUserLeave: false },
      },
    });

    if (existingRoom) {
      console.log("User is already in the room:", userInfo.userId);
      return res.status(409).json({ message: "You are already in the room" });
    }
    const roomData = await RoomModel.findOne({ roomId });
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isUserNameTaken = await roomData.usersInfo.some(
      (user: any) => user.userName === userInfo.userName
    );
    if (isUserNameTaken) {
      console.log("User name is already in the room:", userInfo.userName);
      return res
        .status(200)
        .json({ message: "You are already in the room or userName taken" });
    }
    // Обновляем данные пользователя
    userInfo.isInGame = true;

    // Добавляем пользователя в комнату
    const updatedRoom = await RoomModel.findOneAndUpdate(
      { roomId },
      { $push: { usersInfo: userInfo } },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Фильтруем список пользователей, исключая тех, кто покинул комнату
    const filteredUsers = await updatedRoom.usersInfo.filter(
      (user) => !user.isUserLeave
    );

    // Уведомляем всех участников комнаты о новом пользователе
    await io
      .to(roomId)
      .emit("userJoined", { roomId, usersInfo: filteredUsers });

    return res.status(200).json({
      message: "Successfully joined the room",
      roomId,
      usersInfo: filteredUsers,
    });
  } catch (error: any) {
    console.error("Error joining room:", error);
    return res
      .status(500)
      .json({ message: "Error joining room", error: error.message });
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

    await io.to(roomId).emit("userLeaved", roomData);
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
    res.sendStatus(200);
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
};

export const inactiveTimer = async (
  req: Request | { body: any },
  res: Response | null
) => {
  try {
    const roomId = req.body === undefined ? req : req.body.roomId;

    await RoomModel.findOneAndUpdate(
      { roomId },
      { $inc: { skippedRoundsinLine: 1 } }, // Увеличение счетчика пропущенных раундов
      { new: true }
    );

    const timeOutOver = await new Promise<boolean>((resolve) => {
      timers[roomId].inactiveTimeout = setTimeout(() => {
        resolve(true);
      }, 6100);
    });

    await io.to(roomId).emit("getInactiveOver");
    await intervalTimer({ body: { roomId } }, null); // Запуск нового таймера раунда

    return res?.status(200).json({ timeOutOver });
  } catch (error) {
    console.error("Error Time inactive", error);
    res?.status(500).json({ message: "Error Time inactive" });
  }
};

export const wordChoosed = async (req: Request, res: Response) => {
  const roomId = await req.body.roomId;

  if (!roomId) {
    return res.status(400).json({ message: "roomId is required" });
  }
  timers[roomId].isFinish = false;

  if (!timers[roomId]) {
    timers[roomId] = {
      wordResponseSent: false,
    };
  }

  if (timers[roomId].wordTimer) {
    console.log("остановка таймера при выборе слова");

    await clearTimeout(timers[roomId].wordTimer); // Остановка таймера выбора слова

    await RoomModel.findOneAndUpdate(
      { roomId },
      { $set: { isWordChosen: true } }, // Обновление состояния, если слово выбрано
      { new: true }
    );

    return res.status(200).json("alles goed");
  }
};

export const intervalTimer = async (
  req: Request | { body: any },
  res: Response | null
) => {
  try {
    const roomId = req.body === undefined ? req : req.body.roomId;

    if (!roomId) {
      return res
        ? res.status(400).json({ message: "roomId is required" })
        : "ERROR";
    }

    const roomData = await RoomModel.findOne({ roomId });

    if (
      roomData &&
      roomData.skippedRoundsinLine &&
      roomData.skippedRoundsinLine > 4
    ) {
      return; // Если пользователи не активны, пропускаем раунд
    }
    const activeUser = await roomData?.activeUser;
    timers[roomId] = timers[roomId] || {};
    if (!activeUser) {
      console.log("в интервале юзера активного нет  ");

      return;
    }
    await io.to(roomId).emit("getAnswer", {
      userName: activeUser.userName,
      message: `${activeUser.userName} has next turn`,
      roomId: roomId,
    });
    timers[roomId].isFinish = true;
    timers[roomId].wordTimer = setTimeout(async () => {
      const currentRoomData = await RoomModel.findOne({ roomId });

      if (currentRoomData?.isWordChosen) {
        console.log(`Слово выбрано для комнаты ${roomId}, таймер остановлен.`);
        return;
      }
      if (timers[roomId].isFinish === true) {
        console.log(
          `Timer ended for room ${roomId}, time to choose word end .`
        );
        await io.to(roomId).emit("getAnswer", {
          userName: activeUser.userName,
          message: `${activeUser.userName} lost turn :()`,
          roomId,
        });
        await handleNextUserCall(null, null, roomId);

        await io.to(roomId).emit("getSkipRound");
        await inactiveTimer({ body: { roomId } }, null);
        return res
          ? res.status(200).json({
              timer: true,
              message: " time to choose word end",
            })
          : { timer: true, message: " time to choose word end" };
      }
    }, 9700);
  } catch (error) {
    console.error("Error Time interval", error);
    res
      ? res.status(500).json({ message: "Error Time interval" })
      : "Error Time interval";
  }
};

export const roundTimer = async (req: Request, res: Response) => {
  try {
    const roomId = await req.body.roomId;
    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const roomData = await RoomModel.findOne({ roomId });
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    await RoomModel.findOneAndUpdate(
      { roomId },
      { skippedRoundsinLine: 0, isRoundOver: false }, // Сброс состояния
      { new: true }
    );

    // Очистка предыдущего таймера, если он был запущен
    if (timers[roomId]?.roundTimer) {
      clearTimeout(timers[roomId].roundTimer);
      delete timers[roomId].roundTimer;
    }

    const data = {
      roomId,
      activeUser: roomData.activeUser,
      users: roomData.usersInfo,
    };

    // Запуск нового таймера
    timers[roomId] = {
      roundTimer: setTimeout(async () => {
        try {
          const updatedRoomData = await RoomModel.findOne({ roomId });

          if (!updatedRoomData?.isRoundOver) {
            console.log(`Timer ended for room game ${roomId}, no one guessed.`);
            await io.to(roomId).emit("getSkipRound");
            await io.to(roomId).emit("getNextUserCall", data);
            await usersNotGuessedTimer({ body: roomId }, null);
          }
        } catch (error) {
          console.error(`Error in round timer for room ${roomId}:`, error);
        }
      }, 50000), // Заменил 50 сек на 7, как ты просил
    };

    return res.status(200).json({ message: "Timer started" });
  } catch (error) {
    console.error("Error Time Round", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const usersNotGuessedTimer = async (
  req: Request | { body: string },
  res: Response | null
) => {
  try {
    const roomId = await req.body;
    await handleNextUserCall(null, null, roomId);
    await io.to(roomId).emit("getAnswer", {
      message: `the answer was`,
      roomId: roomId,
    });
    await io.to(roomId).emit("getAnswer", {
      message: "interval@@",
      roomId: roomId,
    });

    const timeOutOver = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });

    await RoomModel.findOneAndUpdate(
      { roomId },
      { isWordChosen: false },
      { new: true }
    );
    await RoomModel.findOneAndUpdate(
      { roomId },
      { usersGuessedList: [] }, // Обновление состояния, если слово выбрано
      { new: true }
    );
    await io.to(roomId).emit("getUsersNotGuessedTimer");
    console.log("в юзеры не угадали ");

    await intervalTimer(roomId, null);
    return { message: "users didnt guessed timer over", status: 200 };
  } catch (error) {
    console.error("Error Time users not guessed", error);
    return { message: "Error Time users not guessed" };
  }
};

export const allUsersGuessed = async (req: Request, res: Response) => {
  try {
    const roomId = req.body.roomId;

    const roomData = await RoomModel.findOne({ roomId });
    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    await RoomModel.findOneAndUpdate(
      {
        roomId: roomId,
      },
      { isRoundOver: true },
      { new: true }
    );

    if (timers[roomId].response) {
      timers[roomId].response
        .status(200)
        .json({ message: "User guessed correctly!" });
      delete timers[roomId].response;
    }

    await handleNextUserCall(null, null, roomId);
    const timeOutOver = await new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        await RoomModel.findOneAndUpdate(
          { roomId },
          { usersGuessedList: [] }, // Обновление состояния, если слово выбрано
          { new: true }
        );
        await RoomModel.findOneAndUpdate(
          { roomId },
          { isWordChosen: false }, // Обновление состояния, если слово выбрано
          { new: true }
        );
        await io.to(roomId).emit("getAllUsersGuessed");
        resolve(true);
      }, 4800);
    });
    await intervalTimer({ body: { roomId } }, null); // Запуск нового таймера раунда

    return res.status(200).json({ timeOutOver });
  } catch (error) {
    console.error("Error Time users all  guessed", error);
    res.status(500).json({ message: "Error Time all users guessed" });
  }
};

export const userGuessedCorrect = async (req: Request, res: Response) => {
  try {
    const { roomId, guessedUser: whoGuessed, activeUser: whoDraw } = req.body;

    if (!roomId || !whoGuessed || !whoDraw) {
      return res.status(400).json({
        message: "roomId, guessed user, and active user are required",
      });
    }

    const roomData = await RoomModel.findOne({ roomId });
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    const userGuessedList = (await roomData.usersGuessedList) || [];
    const roomUsers = (await roomData.usersInfo) || [];

    // Добавляем пользователя в список угаданных
    if (!userGuessedList.includes(whoGuessed.userName)) {
      userGuessedList.push(whoGuessed.userName);
    }

    const maxPoints = 30;
    const guessedUsersLength = userGuessedList.filter(
      (user) => !user.isUserLeave
    ).length;
    const points = Math.round(
      guessedUsersLength > 1 ? maxPoints / guessedUsersLength : 13
    );
    const activeUserPoints = Math.round(points - 7);

    // Используем bulkWrite для выполнения всех обновлений в одном запросе
    const bulkOperations = [
      {
        updateOne: {
          filter: { roomId, "usersInfo.userName": whoGuessed.userName },
          update: {
            $inc: { "usersInfo.$.userPoints": points },
            $set: { "usersInfo.$.addedPoints": points },
          },
        },
      },
      {
        updateOne: {
          filter: { roomId, "usersInfo.userName": whoDraw.userName },
          update: {
            $inc: { "usersInfo.$.userPoints": activeUserPoints },
            $set: {
              "usersInfo.$.isActive": true,
              "usersInfo.$.addedPoints": activeUserPoints,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { roomId },
          update: { $set: { usersGuessedList: userGuessedList } },
        },
      },
    ];

    const bulkWriteResult = await RoomModel.bulkWrite(bulkOperations, {
      ordered: true,
    });

    // Сразу после выполнения bulkWrite, проверяем обновленные данные
    const updatedRoomData = await RoomModel.findOne({ roomId });

    if (
      guessedUsersLength ===
      roomUsers.filter((user) => !user.isUserLeave).length - 1
    ) {
      await io.to(roomId).emit("getAnswer", {
        userName: "",
        message: "Everybody guessed correctly!",
        roomId,
        isAllGuessed: true,
      });
      await io.to(roomId).emit("getAnswer", {
        userName: "",
        message: "Interval...",
        roomId,
      });

      return res.status(200).json({
        message: "Everybody guessed correctly",
        usersGuessedList: userGuessedList,
        usersList: updatedRoomData?.usersInfo,
      });
    }

    return res.status(200).json({
      usersGuessedList: userGuessedList,
      usersList: updatedRoomData?.usersInfo,
    });
  } catch (error) {
    console.error("Error updating user guessed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const userLeavesRoom = async (roomId: string, userId: string) => {
  if (!userId) {
    return { message: "Invalid request" };
  }
  const user = await RoomModel.findOne({ roomId, "usersInfo.userId": userId });
  try {
    if (!user) {
      return { message: "User not found" };
    }
    const bulkOperations = [
      {
        updateOne: {
          filter: { roomId },
          update: {
            $set: { "usersInfo.$[user].isUserLeave": true },
          },
          arrayFilters: [{ "user.userId": userId }], // Обновляет всех с userId
        },
      },
      {
        updateOne: {
          filter: { roomId },
          update: {
            $inc: { usersLeftCount: 1 },
          },
        },
      },
    ];

    await RoomModel.bulkWrite(bulkOperations, { ordered: true });

    const updatedRoomData = await RoomModel.findOne({ roomId });
    if (!updatedRoomData) {
      return { message: "Room not found" };
    }

    const roomUsers = (await updatedRoomData.usersInfo) || [];
    const remainUsers = roomUsers.filter((user) => !user.isUserLeave);

    // Сценарий: если остался один пользователь
    if (updatedRoomData.isGameStarted && remainUsers.length === 1) {
      await io.to(roomId).emit("getRoomDeletedWarning", {
        roomId,
        message:
          "Game ended. Only one user remaining. Room will be deleted in 15 seconds.",
      });
      return { message: "Game ended. Only one user remaining." };
    }

    // Сценарий: если активный пользователь покинул комнату
    if (
      updatedRoomData.activeUser &&
      updatedRoomData.activeUser.userId === userId
    ) {
      console.log("Active user left the room");
      await handleNextUserCall(null, null, roomId);

      const resetFields = {
        isRoundOver: true,
        usersGuessedList: [],
        isWordChosen: false,
      };

      await RoomModel.findOneAndUpdate({ roomId }, { $set: resetFields });

      await io.to(roomId).emit("getActiveUserLeaved");
      setTimeout(() => {
        console.log("5 seconds passed");
        io.to(roomId).emit("getActiveUserLeavedTimer");
      }, 5000);

      intervalTimer({ body: { roomId } }, null);
    }

    // Сценарий: если все пользователи покинули комнату
    if (roomUsers.every((user) => user.isUserLeave)) {
      if (timers[roomId]) {
        clearTimeout(timers[roomId].wordTimer);
        clearTimeout(timers[roomId].roundTimer);
        clearTimeout(timers[roomId].inactiveTimeout);
        delete timers[roomId];
      }

      await RoomModel.deleteOne({ roomId });
      console.log("Room deleted because all users left");

      return { message: "All users left, room deleted" };
    }

    // Сценарий: если хост покинул комнату
    if (updatedRoomData.host.hostId === userId) {
      console.log("Host left the room");
      const nextHost = remainUsers[0];
      if (nextHost) {
        await RoomModel.findOneAndUpdate(
          { roomId },
          {
            $set: {
              host: {
                hostName: nextHost.userName,
                hostId: nextHost.userId,
              },
            },
          }
        );
      }
    }

    // Уведомление о выходе пользователя
    await io.to(roomId).emit("getUserLeft", {
      roomId,
      userName: userId,
      roomUsers: remainUsers,
      host: remainUsers[0],
    });

    return { message: "User left the room" };
  } catch (error) {
    console.error("Error in userLeavesRoom:", error);
    return { message: "Error in userLeavesRoom operation" };
  }
};

export const updateUserState = async (req: Request, res: Response) => {
  const roomId = await req.body.roomId;
  const userId = await req.body.userId;
  if (roomId && userId) {
    const bulkOperations = [
      {
        updateOne: {
          filter: { roomId },
          update: {
            $set: { "usersInfo.$[user].isUserInLobby": true },
          },
          arrayFilters: [{ "user.userId": userId }], // Фильтр обновляет только пользователей с нужным userId
        },
      },
    ];
    console.log("boos");

    const bulkWriteResult = await RoomModel.bulkWrite(bulkOperations, {
      ordered: true,
    });

    const updatedRoomData = await RoomModel.findOne({ roomId });
    return res.status(200).json({
      message: "user state upgraded with no error",
      roomUsers: updatedRoomData?.usersInfo.filter((user) => !user.isUserLeave),
    });
  }
};

const userTimeouts = new Map(); // Хранит таймеры для каждого пользователя

export const Ping = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;

  if (!userId || !roomId) {
    return res.status(400).send("userId and roomId are required");
  }
  const roomData = await RoomModel.findOne({ roomId });
  const currentUser = await roomData?.usersInfo.find((user) => {
    return user.userId === userId;
  });
  if (!roomData) {
    return res.status(404).json({ message: "Room not found" });
  }

  const userRoomKey = `${roomId}-${userId}`; // Создаем уникальный ключ для пользователя в комнат
  if (
    (currentUser && !roomData) ||
    (!roomData && currentUser && currentUser.isUserLeave)
  ) {
    if (timers[roomId]) {
      clearTimeout(timers[roomId].wordTimer);
      clearTimeout(timers[roomId].roundTimer);
      clearTimeout(timers[roomId].inactiveTimeout);
      delete timers[roomId];
    }
    return res.status(404).json({ message: "Room no longer exists" });

    // Если ping получен, сбрасываем таймер для данного пользователя в данной комнате
  }
  console.log(`Received ping from user ${userId} in room ${roomId}`);
  if (userTimeouts.has(userRoomKey)) {
    clearTimeout(userTimeouts.get(userRoomKey));
  }

  const timeoutId = setTimeout(async () => {
    console.log(
      `User ${userId} is inactive for too long. Taking action in ROOM ${roomId}`
    );

    await userLeavesRoom(roomId, userId);
  }, 20000);

  userTimeouts.set(userRoomKey, timeoutId);

  res.send("Ping received");
};
// Запуск функции проверки таймеров
