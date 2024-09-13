import { RoomModel } from "../models/roomModel";
import { Request, Response, json } from "express";
import { io } from "../server";
const roomStates: any = {};
const timers: any = {};
const getNextActiveUser = (users: any) => {
  const activeUser = users.find((user: any) => user.isActive);
  if (!activeUser) {
    return users[0];
  }
  const activeIndex = users.findIndex((user: any) => user.isActive);
  const nextIndex = activeIndex === users.length - 1 ? 0 : activeIndex + 1;

  return users[nextIndex];
};

const updateUserActivity = (users: any, nextActiveUser: any) => {
  return users.map((user: any) => ({
    ...user,
    isActive: user.userName === nextActiveUser.userName,
  }));
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

  // Сохраняем состояние победы в состоянии комнаты
};

export const handleNextUserCall = async (
  req: Request | null,
  res: Response | null,
  roomId: any
) => {
  const roomFirstId = req?.body.roomId;
  const roomData = await RoomModel.findOne({
    roomId: roomFirstId ? roomFirstId : roomId,
  });

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

  const users = roomData?.usersInfo;
  const maxGamePoints = roomData?.points;
  if (!users || !maxGamePoints) {
    return;
  }

  const nextActiveUser = await getNextActiveUser(users);
  const updatedUsers = await updateUserActivity(users, nextActiveUser);
  await RoomModel.findOneAndUpdate(
    {
      roomId: roomFirstId ? roomFirstId : roomId,
    },
    { $set: { activeUser: nextActiveUser } },
    { new: true }
  );
  const roomInfo = await RoomModel.findOne({ roomId });
  const activeUser = await roomInfo?.activeUser;

  const updatedUsersInfo = await RoomModel.findOneAndUpdate(
    {
      roomId: roomFirstId ? roomFirstId : roomId,
    },
    { usersInfo: updatedUsers },
    { new: true }
  );

  if (isGameWon(users, maxGamePoints)) {
    console.log("is game won", users);

    handleGameWin(
      roomId.length !== 6 ? roomFirstId : roomId,
      users,
      maxGamePoints
    );

    const roomInfo = await RoomModel.findOne({ roomId });
    const gameWinners = roomInfo?.gameWinners;
    io.to(roomId.length !== 6 ? roomFirstId : roomId).emit("gameWon", {
      winners: gameWinners,
    });
  } else {
    io.to(roomId.length !== 6 ? roomFirstId : roomId).emit("getNextUserCall", {
      activeUser: nextActiveUser,
      users: updatedUsersInfo?.usersInfo,
    });
  }
  return res ? res?.status(200).json("alles goed") : "";
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    // Получаем данные для создания комнаты из запроса

    const { host, points, players, thema, usersInfo, roomId } = req.body;

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
    const userId = req.query.userId; // Получаем параметр userId из строки запроса
    const roomId = req.query.roomId; // Получаем параметр roomId из строки запроса
    const roomData = await RoomModel.find({ roomId: roomId });
    if (roomData.length === 0) {
      return res.status(404).json({ message: "Room does not exist" });
    }

    if (roomData[0].host.hostId === userId) {
      console.log("zxc1");
    }
    return res.status(201).json(roomData);
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
    if (!roomData) {
      return res.status(400).json({ message: "ERROR! ROOM DATA NOT FOUND" });
    }
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

    io.to(roomId).emit("getInactiveOver");
    intervalTimer({ body: { roomId } }, null); // Запуск нового таймера раунда

    return res?.status(200).json({ timeOutOver });
  } catch (error) {
    console.error("Error Time inactive", error);
    res?.status(500).json({ message: "Error Time inactive" });
  }
};

export const wordChoosed = async (req: Request, res: Response) => {
  const roomId = req.body.roomId;

  if (!roomId) {
    return res.status(400).json({ message: "roomId is required" });
  }
  timers[roomId].isFinish = false;
  const roomData = await RoomModel.findOne({ roomId });

  if (!timers[roomId]) {
    timers[roomId] = {
      wordResponseSent: false,
    };
  }

  if (timers[roomId].wordTimer) {
    console.log("остановка таймера");

    clearTimeout(timers[roomId].wordTimer); // Остановка таймера выбора слова

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
      console.log("в интервале нет активного юзера ");

      return;
    }
    io.to(roomId).emit("getAnswer", {
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
        io.to(roomId).emit("getAnswer", {
          userName: activeUser.userName,
          message: `${activeUser.userName} lost turn :()`,
          roomId,
        });
        handleNextUserCall(null, null, roomId);

        io.to(roomId).emit("getSkipRound");
        inactiveTimer({ body: { roomId } }, null);
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
    const roomId = req.body.roomId;
    const roomData = await RoomModel.findOne({ roomId });
    await RoomModel.findOneAndUpdate(
      { roomId },
      { skippedRoundsinLine: 0, isRoundOver: false }, // Сброс состояния
      { new: true }
    );

    if (timers[roomId]?.roundTimer) {
      clearTimeout(timers[roomId].roundTimer);
      delete timers[roomId].roundTimer;
    }

    const data = {
      roomId,
      activeUser: roomData?.activeUser,
    };

    timers[roomId].roundTimer = setTimeout(async () => {
      const updatedRoomData = await RoomModel.findOne({ roomId });

      if (!updatedRoomData?.isRoundOver) {
        console.log(`Timer ended for room ${roomId}, no one guessed.`);
        io.to(roomId).emit("getSkipRound");
        io.to(roomId).emit("getNextUserCall", data);

        usersNotGuessedTimer({ body: roomId }, null);
        res.status(200).json({ timer: true, message: "round timer is over" });
      }
    }, 50000);

    timers[roomId].response = res;
  } catch (error) {
    console.error("Error Time Round", error);
    res.status(500).json({ message: "Error Time Round" });
  }
};

export const usersNotGuessedTimer = async (
  req: Request | { body: string },
  res: Response | null
) => {
  try {
    console.log("в юзеры не угадали айди", req);

    const roomId = req.body;
    io.to(roomId).emit("getAnswer", {
      message: `the answer was`,
      roomId: roomId,
    });
    io.to(roomId).emit("getAnswer", {
      message: "interval@@",
      roomId: roomId,
    });
    const timeOutOver = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });
    await handleNextUserCall(null, null, roomId);
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
    io.to(roomId).emit("getUsersNotGuessedTimer");
    console.log("в юзеры не угадали ");

    intervalTimer(roomId, null);
    return { message: "users didnt guessed timer over", status: 200 };
  } catch (error) {
    console.error("Error Time users not guessed", error);
    return { message: "Error Time users not guessed" };
  }
};

export const allUsersGuessed = async (req: Request, res: Response) => {
  try {
    const roomId = req.body.roomId;
    console.log(roomId, "ROOO!@");

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

    handleNextUserCall(null, null, roomId);
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
        io.to(roomId).emit("getAllUsersGuessed");
        resolve(true);
      }, 4800);
    });
    intervalTimer({ body: { roomId } }, null); // Запуск нового таймера раунда

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

    const userGuessedList = roomData.usersGuessedList || [];
    const roomUsers = roomData.usersInfo || [];

    // Добавляем пользователя в список угаданных
    if (!userGuessedList.includes(whoGuessed.userName)) {
      userGuessedList.push(whoGuessed.userName);
    }

    const maxPoints = 30;
    const guessedUsersLength = userGuessedList.length;
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

    if (guessedUsersLength === roomUsers.length - 1) {
      io.to(roomId).emit("getAnswer", {
        userName: "",
        message: "Everybody guessed correctly!",
        roomId,
        isAllGuessed: true,
      });
      io.to(roomId).emit("getAnswer", {
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
  if (userId) {
    try {
      const bulkOperations = [
        {
          updateOne: {
            filter: { roomId, "usersInfo.userId": userId },
            update: {
              $set: { "usersInfo.$.isUserLeave": true },
            },
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

      const bulkWriteResult = await RoomModel.bulkWrite(bulkOperations, {
        ordered: true,
      });

      const updatedRoomData = await RoomModel.findOne({ roomId });
      const usersLeftCount = updatedRoomData?.usersLeftCount;
      const roomUsers = updatedRoomData?.usersInfo;

      if (usersLeftCount === roomUsers?.length) {
        // Очистка всех таймеров и прекращение выполнения функций
        if (timers[roomId]) {
          clearTimeout(timers[roomId].wordTimer);
          clearTimeout(timers[roomId].roundTimer);
          clearTimeout(timers[roomId].inactiveTimeout);
          delete timers[roomId];
        }
        // Удаление комнаты
        await RoomModel.deleteOne({ roomId });
        console.log("ROOM DELETED ");

        return { message: "All users left, room deleted" };
      }

      return { message: "User left the room" };
    } catch (error) {
      console.error("Error in bulkWrite operation", error);
      return { message: "Error in bulkWrite operation" };
    }
  }

  return { message: "Invalid request" };
};

export const updateUserState = async (req: Request, res: Response) => {
  const roomId = req.body.roomId;
  const userId = req.body.userId;
  if (roomId && userId) {
    const bulkOperations = [
      {
        updateOne: {
          filter: { roomId, "usersInfo.userId": userId },
          update: {
            $set: { "usersInfo.$.isUserInLobby": true },
          },
        },
      },
    ];

    const bulkWriteResult = await RoomModel.bulkWrite(bulkOperations, {
      ordered: true,
    });

    const updatedRoomData = await RoomModel.findOne({ roomId });
    return res.status(200).json({
      message: "user state upgraded with no error",
      roomUsers: updatedRoomData?.usersInfo,
    });
  }
};
// export async function startTimer(req: Request, res: Response) {
//   try {
//     const userId = req.body.userId;
//     const roomId = req.body.roomId;
//     console.log("body", req.body);

//     await RoomModel.updateOne(
//       { roomId: roomId, "usersInfo.userId": userId },
//       {
//         $set: {
//           "usersInfo.$.startTime": new Date(), // Сохраняем время начала
//           "usersInfo.$.elapsedTime": 0, // Инициализируем elapsedTime
//         },
//       }
//     );

//     console.log(
//       `Таймер для пользователя ${userId} в комнате ${roomId} запущен.`
//     );

//     const intervalId = setInterval(async () => {
//       const resp = await checkTimers(roomId, userId);

//       if (resp) {
//         clearInterval(intervalId);
//       }
//     }, 10000);
//   } catch (err) {
//     console.error("Ошибка при запуске таймера:", err);
//   } finally {
//   }
// }

async function checkTimers(roomId: string, userId: string) {
  try {
    const now = new Date();
    const nowInMs = now.getTime(); // Текущее время в миллисекундах

    // Получаем текущее состояние таймера пользователя
    const updatedDoc = await RoomModel.findOne(
      { roomId: roomId, "usersInfo.userId": userId },
      { "usersInfo.$": 1 } // Получаем только информацию о конкретном пользователе
    );

    if (
      !updatedDoc ||
      !updatedDoc.usersInfo ||
      updatedDoc.usersInfo.length === 0
    ) {
      console.log("Пользователь не найден в комнате.");
      return false;
    }

    const user = updatedDoc.usersInfo.find((user) => user.userId === userId);

    const startTime = new Date(user.startTime).getTime(); // Время начала таймера в миллисекундах
    const elapsedTimeInMs = nowInMs - startTime; // Прошедшее время в миллисекундах
    const elapsedTimeInSeconds = Math.floor(elapsedTimeInMs / 1000); // Прошедшее время в секундах

    if (elapsedTimeInSeconds === 30) {
      io.to(roomId).emit("getInactiveUsers1", { userId });
    }
    // Проверяем, если прошло больше 60 секунд
    if (elapsedTimeInSeconds >= 60) {
      return true;
    } else {
      // console.log("Таймер меньше 60 секунд");
      return false;
    }
  } catch (err) {
    console.error("Ошибка при работе с MongoDB:", err);
    return false;
  }
}
const userTimeouts = new Map(); // Хранит таймеры для каждого пользователя

// Обработчик для POST-запросов, сигнализирующих об активности клиента
// Хранилище для таймеров

export const Ping = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;

  if (!userId || !roomId) {
    return res.status(400).send("userId and roomId are required");
  }
  const rooomData = await RoomModel.findOne({ roomId });
  const currentUser = await rooomData?.usersInfo.find((user) => {
    return user.userId === userId;
  });

  const userRoomKey = `${roomId}-${userId}`; // Создаем уникальный ключ для пользователя в комнат
  if (!rooomData || currentUser.isUserLeave) {
    return res.status(404).json({ message: "Room no longer exists" });

    // Если ping получен, сбрасываем таймер для данного пользователя в данной комнате
  }
  console.log(`Received ping from user ${userId} in room ${roomId}`);
  if (userTimeouts.has(userRoomKey)) {
    clearTimeout(userTimeouts.get(userRoomKey));
  }

  // Устанавливаем новый таймер для пользователя в комнате
  const timeoutId = setTimeout(() => {
    console.log(
      `User ${userId} is inactive for too long. Taking action in ROOM ${roomId}`
    );
    // Действия при отсутствии ping, например, удаление пользователя из комнаты
    userLeavesRoom(roomId, userId);
  }, 20000); // Установите тайм-аут на 20 секунд или другой период времени

  // Сохраняем таймер по уникальному ключу
  userTimeouts.set(userRoomKey, timeoutId);

  res.send("Ping received");
};

// Запуск функции проверки таймеров
