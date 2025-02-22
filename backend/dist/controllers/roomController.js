"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = exports.updateUserState = exports.userLeavesRoom = exports.userGuessedCorrect = exports.allUsersGuessed = exports.usersNotGuessedTimer = exports.roundTimer = exports.intervalTimer = exports.wordChoosed = exports.inactiveTimer = exports.test = exports.leaveRoom = exports.joinRoom = exports.getRoomInfo = exports.createRoom = exports.isUserInGame = exports.handleNextUserCall = void 0;
const roomModel_1 = require("../models/roomModel");
const server_1 = require("../server");
const roomStates = {};
const timers = {};
const getNextActiveUser = (users) => {
    // Фильтруем пользователей с минимальным activeCount
    const minActiveCount = Math.min(...users.map((user) => user.activeCount || 0));
    const nextActiveUsers = users.filter((user) => (user.activeCount || 0) === minActiveCount);
    // Если есть несколько, выбираем первого
    return nextActiveUsers[0];
};
const updateUserActivity = (users, nextActiveUser) => {
    return users.map((user) => {
        console.log(user, "next", nextActiveUser);
        return Object.assign(Object.assign({}, user), { isActive: user.userName === nextActiveUser.userName, activeCount: user.userName === nextActiveUser.userName
                ? (user.activeCount || 0) + 1 // Увеличиваем счётчик активности
                : user.activeCount || 0 });
    });
};
const isGameWon = (roomUsers, maxGamePoints) => {
    return roomUsers.some((user) => user.userPoints >= maxGamePoints);
};
const handleGameWin = (roomId, roomUsers, maxGamePoints) => __awaiter(void 0, void 0, void 0, function* () {
    const listWinners = roomUsers.filter((user) => roomUsers.length > 3 ? user.userPoints >= maxGamePoints : user.userPoints);
    const winners = listWinners
        .sort((a, b) => b.userPoints - a.userPoints)
        .slice(0, 3);
    yield roomModel_1.RoomModel.findOneAndUpdate({ roomId: roomId }, { $set: { gameWinners: winners } }, { new: true });
    return winners;
    // Сохраняем состояние победы в состоянии комнаты
});
const handleNextUserCall = (req, res, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomFirstId = yield (req === null || req === void 0 ? void 0 : req.body.roomId);
        const roomData = yield roomModel_1.RoomModel.findOne({
            roomId: roomFirstId ? roomFirstId : roomId,
        });
        console.log("roomddata found 20002 ", roomData);
        if (!roomData) {
            return { message: "Room data not found. ERROR" };
        }
        if (roomData.isGameStarted === false) {
            yield roomModel_1.RoomModel.findOneAndUpdate({ roomId: roomFirstId ? roomFirstId : roomId }, { isGameStarted: true }, { new: true });
        }
        const users = yield (roomData === null || roomData === void 0 ? void 0 : roomData.usersInfo.filter((user) => !user.isUserLeave));
        const maxGamePoints = yield (roomData === null || roomData === void 0 ? void 0 : roomData.points);
        if (!users || !maxGamePoints) {
            return;
        }
        // Выбираем следующего активного пользователя
        const nextActiveUser = yield getNextActiveUser(users);
        // Обновляем активность и счётчики
        const updatedUsers = yield updateUserActivity(users, nextActiveUser);
        console.log(updatedUsers);
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId: roomFirstId ? roomFirstId : roomId }, { $set: { activeUser: nextActiveUser, usersInfo: updatedUsers } }, { new: true });
        if (isGameWon(users, maxGamePoints)) {
            console.log("game won");
            const gameWinners = yield handleGameWin(roomId.length !== 6 ? roomFirstId : roomId, users, maxGamePoints);
            server_1.io.to(roomId.length !== 6 ? roomFirstId : roomId).emit("gameWon", {
                winners: gameWinners,
            });
        }
        else {
            const updatedRoom = yield roomModel_1.RoomModel.findOne({ roomId });
            const remainingUsers = yield (updatedRoom === null || updatedRoom === void 0 ? void 0 : updatedRoom.usersInfo.filter((user) => !user.isUserLeave));
            console.log(remainingUsers === null || remainingUsers === void 0 ? void 0 : remainingUsers.length, "LENGTH REMAIN Users12", updatedRoom);
            yield server_1.io
                .to(roomId.length !== 6 ? roomFirstId : roomId)
                .emit("getNextUserCall", {
                activeUser: nextActiveUser,
                users: remainingUsers
                    ? remainingUsers
                    : updatedUsers.filter((user) => !user.isUserLeave),
                test: "test",
            });
        }
        return res ? res === null || res === void 0 ? void 0 : res.status(200).json("alles goed") : "";
    }
    catch (err) {
        console.log("ERROR WHEN UPDATING NEXT ACTIVE USER", err);
    }
});
exports.handleNextUserCall = handleNextUserCall;
const isUserInGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        console.log("USERID", userId, "BOD", req.body);
        const isPlayerFound = yield roomModel_1.RoomModel.find({
            usersInfo: {
                $elemMatch: { userId: userId, isUserLeave: undefined },
            },
        }, { maxTimeMS: 10000 });
        console.log("IS PLAYER FOUND", isPlayerFound.length, userId);
        if (isPlayerFound.length >= 1 && userId !== null) {
            console.log("REDIRECT TO MAIN PAGE SECOND ACTIVE GAME", userId);
            return res.status(200).json({ message: "You are already in the room" });
        }
        return res.status(200).json({ message: "User is not in the game" });
    }
    catch (error) {
        if (error.name === "MongoTimeoutError") {
            return res.status(408).json({ message: "Request timeout" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.isUserInGame = isUserInGame;
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Получаем данные для создания комнаты из запроса
        const { host, points, players, thema, usersInfo, roomId } = req.body;
        const isPlayerFound = yield roomModel_1.RoomModel.find({
            usersInfo: {
                $elemMatch: { userId: host.hostId, isUserLeave: undefined },
            },
        });
        console.log("IS PLAYER FOUND", isPlayerFound.length, host.hostId);
        if (isPlayerFound.length >= 1 && host.hostId !== null) {
            console.log("REDIRECT TO MAIN PAGE SECOND ACTIVE GAME", host.hostId);
            return res.status(200).json({ message: "You are already in the room" });
        }
        const isUserCreateRoom = yield roomModel_1.RoomModel.findOne({
            "host.hostId": host.hostId,
        });
        // if (isUserCreateRoom) {
        //   await RoomModel.deleteMany({ host: host });
        // }
        // Создаем новую комнату в базе данных
        const newRoom = new roomModel_1.RoomModel({
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
        yield newRoom.save();
        console.log("sucessesfull created room ");
        res.status(201).json({
            message: "Room created successfully",
            data: { roomId, host, players, thema, usersInfo, points },
        });
    }
    catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Error creating room" });
    }
});
exports.createRoom = createRoom;
const getRoomInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.query;
        if (!roomId) {
            return res.status(400).json({ message: "Room ID is required" });
        }
        // Находим комнату
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!roomData) {
            return res.status(404).json({ message: "Room does not exist" });
        }
        // Фильтруем только активных пользователей (не покинули комнату)
        const filteredUsers = yield roomData.usersInfo.filter((user) => !user.isUserLeave);
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
    }
    catch (error) {
        console.error("Error getting room:", error);
        return res
            .status(500)
            .json({ message: "Error getting room", error: error.message });
    }
});
exports.getRoomInfo = getRoomInfo;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userInfo } = req.body;
        if (!roomId || !userInfo || !userInfo.userId) {
            return res.status(400).json({ message: "Invalid data" });
        }
        // Проверяем, есть ли пользователь уже в комнате
        const existingRoom = yield roomModel_1.RoomModel.findOne({
            roomId,
            usersInfo: {
                $elemMatch: { userId: userInfo.userId, isUserLeave: false },
            },
        });
        if (existingRoom) {
            console.log("User is already in the room:", userInfo.userId);
            return res.status(409).json({ message: "You are already in the room" });
        }
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        const isUserNameTaken = yield roomData.usersInfo.some((user) => user.userName === userInfo.userName);
        if (isUserNameTaken) {
            console.log("User name is already in the room:", userInfo.userName);
            return res
                .status(200)
                .json({ message: "You are already in the room or userName taken" });
        }
        // Обновляем данные пользователя
        userInfo.isInGame = true;
        // Добавляем пользователя в комнату
        const updatedRoom = yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { $push: { usersInfo: userInfo } }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        // Фильтруем список пользователей, исключая тех, кто покинул комнату
        const filteredUsers = yield updatedRoom.usersInfo.filter((user) => !user.isUserLeave);
        // Уведомляем всех участников комнаты о новом пользователе
        yield server_1.io
            .to(roomId)
            .emit("userJoined", { roomId, usersInfo: filteredUsers });
        return res.status(200).json({
            message: "Successfully joined the room",
            roomId,
            usersInfo: filteredUsers,
        });
    }
    catch (error) {
        console.error("Error joining room:", error);
        return res
            .status(500)
            .json({ message: "Error joining room", error: error.message });
    }
});
exports.joinRoom = joinRoom;
const leaveRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userName } = req.body;
        const roomData = yield roomModel_1.RoomModel.findOneAndUpdate({ roomId: roomId }, {
            $pull: {
                usersInfo: { userName: userName },
            },
        }, { new: true });
        console.log("user Leaved");
        yield server_1.io.to(roomId).emit("userLeaved", roomData);
        return res
            .status(200)
            .json({ message: "Successfully left the room", roomData });
    }
    catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({ message: "Error leaving room" });
    }
});
exports.leaveRoom = leaveRoom;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({ message: "Error leaving room" });
    }
});
exports.test = test;
const inactiveTimer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.body === undefined ? req : req.body.roomId;
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { $inc: { skippedRoundsinLine: 1 } }, // Увеличение счетчика пропущенных раундов
        { new: true });
        const timeOutOver = yield new Promise((resolve) => {
            timers[roomId].inactiveTimeout = setTimeout(() => {
                resolve(true);
            }, 6100);
        });
        yield server_1.io.to(roomId).emit("getInactiveOver");
        yield (0, exports.intervalTimer)({ body: { roomId } }, null); // Запуск нового таймера раунда
        return res === null || res === void 0 ? void 0 : res.status(200).json({ timeOutOver });
    }
    catch (error) {
        console.error("Error Time inactive", error);
        res === null || res === void 0 ? void 0 : res.status(500).json({ message: "Error Time inactive" });
    }
});
exports.inactiveTimer = inactiveTimer;
const wordChoosed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = yield req.body.roomId;
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
        yield clearTimeout(timers[roomId].wordTimer); // Остановка таймера выбора слова
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { $set: { isWordChosen: true } }, // Обновление состояния, если слово выбрано
        { new: true });
        return res.status(200).json("alles goed");
    }
});
exports.wordChoosed = wordChoosed;
const intervalTimer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.body === undefined ? req : req.body.roomId;
        if (!roomId) {
            return res
                ? res.status(400).json({ message: "roomId is required" })
                : "ERROR";
        }
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (roomData &&
            roomData.skippedRoundsinLine &&
            roomData.skippedRoundsinLine > 4) {
            return; // Если пользователи не активны, пропускаем раунд
        }
        const activeUser = yield (roomData === null || roomData === void 0 ? void 0 : roomData.activeUser);
        timers[roomId] = timers[roomId] || {};
        if (!activeUser) {
            console.log("в интервале юзера активного нет  ");
            return;
        }
        yield server_1.io.to(roomId).emit("getAnswer", {
            userName: activeUser.userName,
            message: `${activeUser.userName} has next turn`,
            roomId: roomId,
        });
        timers[roomId].isFinish = true;
        timers[roomId].wordTimer = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const currentRoomData = yield roomModel_1.RoomModel.findOne({ roomId });
            if (currentRoomData === null || currentRoomData === void 0 ? void 0 : currentRoomData.isWordChosen) {
                console.log(`Слово выбрано для комнаты ${roomId}, таймер остановлен.`);
                return;
            }
            if (timers[roomId].isFinish === true) {
                console.log(`Timer ended for room ${roomId}, time to choose word end .`);
                yield server_1.io.to(roomId).emit("getAnswer", {
                    userName: activeUser.userName,
                    message: `${activeUser.userName} lost turn :()`,
                    roomId,
                });
                yield (0, exports.handleNextUserCall)(null, null, roomId);
                yield server_1.io.to(roomId).emit("getSkipRound");
                yield (0, exports.inactiveTimer)({ body: { roomId } }, null);
                return res
                    ? res.status(200).json({
                        timer: true,
                        message: " time to choose word end",
                    })
                    : { timer: true, message: " time to choose word end" };
            }
        }), 9700);
    }
    catch (error) {
        console.error("Error Time interval", error);
        res
            ? res.status(500).json({ message: "Error Time interval" })
            : "Error Time interval";
    }
});
exports.intervalTimer = intervalTimer;
const roundTimer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const roomId = yield req.body.roomId;
        if (!roomId) {
            return res.status(400).json({ message: "roomId is required" });
        }
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { skippedRoundsinLine: 0, isRoundOver: false }, // Сброс состояния
        { new: true });
        // Очистка предыдущего таймера, если он был запущен
        if ((_a = timers[roomId]) === null || _a === void 0 ? void 0 : _a.roundTimer) {
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
            roundTimer: setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const updatedRoomData = yield roomModel_1.RoomModel.findOne({ roomId });
                    if (!(updatedRoomData === null || updatedRoomData === void 0 ? void 0 : updatedRoomData.isRoundOver)) {
                        console.log(`Timer ended for room game ${roomId}, no one guessed.`);
                        yield server_1.io.to(roomId).emit("getSkipRound");
                        yield server_1.io.to(roomId).emit("getNextUserCall", data);
                        yield (0, exports.usersNotGuessedTimer)({ body: roomId }, null);
                    }
                }
                catch (error) {
                    console.error(`Error in round timer for room ${roomId}:`, error);
                }
            }), 50000), // Заменил 50 сек на 7, как ты просил
        };
        return res.status(200).json({ message: "Timer started" });
    }
    catch (error) {
        console.error("Error Time Round", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});
exports.roundTimer = roundTimer;
const usersNotGuessedTimer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = yield req.body;
        yield (0, exports.handleNextUserCall)(null, null, roomId);
        yield server_1.io.to(roomId).emit("getAnswer", {
            message: `the answer was`,
            roomId: roomId,
        });
        yield server_1.io.to(roomId).emit("getAnswer", {
            message: "interval@@",
            roomId: roomId,
        });
        const timeOutOver = yield new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 5000);
        });
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { isWordChosen: false }, { new: true });
        yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { usersGuessedList: [] }, // Обновление состояния, если слово выбрано
        { new: true });
        yield server_1.io.to(roomId).emit("getUsersNotGuessedTimer");
        console.log("в юзеры не угадали ");
        yield (0, exports.intervalTimer)(roomId, null);
        return { message: "users didnt guessed timer over", status: 200 };
    }
    catch (error) {
        console.error("Error Time users not guessed", error);
        return { message: "Error Time users not guessed" };
    }
});
exports.usersNotGuessedTimer = usersNotGuessedTimer;
const allUsersGuessed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.body.roomId;
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!roomId) {
            return res.status(400).json({ message: "roomId is required" });
        }
        yield roomModel_1.RoomModel.findOneAndUpdate({
            roomId: roomId,
        }, { isRoundOver: true }, { new: true });
        if (timers[roomId].response) {
            timers[roomId].response
                .status(200)
                .json({ message: "User guessed correctly!" });
            delete timers[roomId].response;
        }
        yield (0, exports.handleNextUserCall)(null, null, roomId);
        const timeOutOver = yield new Promise((resolve) => {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { usersGuessedList: [] }, // Обновление состояния, если слово выбрано
                { new: true });
                yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { isWordChosen: false }, // Обновление состояния, если слово выбрано
                { new: true });
                yield server_1.io.to(roomId).emit("getAllUsersGuessed");
                resolve(true);
            }), 4800);
        });
        yield (0, exports.intervalTimer)({ body: { roomId } }, null); // Запуск нового таймера раунда
        return res.status(200).json({ timeOutOver });
    }
    catch (error) {
        console.error("Error Time users all  guessed", error);
        res.status(500).json({ message: "Error Time all users guessed" });
    }
});
exports.allUsersGuessed = allUsersGuessed;
const userGuessedCorrect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, guessedUser: whoGuessed, activeUser: whoDraw } = req.body;
        if (!roomId || !whoGuessed || !whoDraw) {
            return res.status(400).json({
                message: "roomId, guessed user, and active user are required",
            });
        }
        const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!roomData) {
            return res.status(404).json({ message: "Room not found" });
        }
        const userGuessedList = (yield roomData.usersGuessedList) || [];
        const roomUsers = (yield roomData.usersInfo) || [];
        // Добавляем пользователя в список угаданных
        if (!userGuessedList.includes(whoGuessed.userName)) {
            userGuessedList.push(whoGuessed.userName);
        }
        const maxPoints = 30;
        const guessedUsersLength = userGuessedList.filter((user) => !user.isUserLeave).length;
        const points = Math.round(guessedUsersLength > 1 ? maxPoints / guessedUsersLength : 13);
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
        const bulkWriteResult = yield roomModel_1.RoomModel.bulkWrite(bulkOperations, {
            ordered: true,
        });
        // Сразу после выполнения bulkWrite, проверяем обновленные данные
        const updatedRoomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (guessedUsersLength ===
            roomUsers.filter((user) => !user.isUserLeave).length - 1) {
            yield server_1.io.to(roomId).emit("getAnswer", {
                userName: "",
                message: "Everybody guessed correctly!",
                roomId,
                isAllGuessed: true,
            });
            yield server_1.io.to(roomId).emit("getAnswer", {
                userName: "",
                message: "Interval...",
                roomId,
            });
            return res.status(200).json({
                message: "Everybody guessed correctly",
                usersGuessedList: userGuessedList,
                usersList: updatedRoomData === null || updatedRoomData === void 0 ? void 0 : updatedRoomData.usersInfo,
            });
        }
        return res.status(200).json({
            usersGuessedList: userGuessedList,
            usersList: updatedRoomData === null || updatedRoomData === void 0 ? void 0 : updatedRoomData.usersInfo,
        });
    }
    catch (error) {
        console.error("Error updating user guessed:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.userGuessedCorrect = userGuessedCorrect;
const userLeavesRoom = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        return { message: "Invalid request" };
    }
    try {
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
        yield roomModel_1.RoomModel.bulkWrite(bulkOperations, { ordered: true });
        const updatedRoomData = yield roomModel_1.RoomModel.findOne({ roomId });
        if (!updatedRoomData) {
            return { message: "Room not found" };
        }
        const roomUsers = (yield updatedRoomData.usersInfo) || [];
        const remainUsers = roomUsers.filter((user) => !user.isUserLeave);
        // Сценарий: если остался один пользователь
        if (updatedRoomData.isGameStarted && remainUsers.length === 1) {
            yield server_1.io.to(roomId).emit("getRoomDeletedWarning", {
                roomId,
                message: "Game ended. Only one user remaining. Room will be deleted in 15 seconds.",
            });
            return { message: "Game ended. Only one user remaining." };
        }
        // Сценарий: если активный пользователь покинул комнату
        if (updatedRoomData.activeUser &&
            updatedRoomData.activeUser.userId === userId) {
            console.log("Active user left the room");
            yield (0, exports.handleNextUserCall)(null, null, roomId);
            const resetFields = {
                isRoundOver: true,
                usersGuessedList: [],
                isWordChosen: false,
            };
            yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, { $set: resetFields });
            yield server_1.io.to(roomId).emit("getActiveUserLeaved");
            setTimeout(() => {
                console.log("5 seconds passed");
                server_1.io.to(roomId).emit("getActiveUserLeavedTimer");
            }, 5000);
            (0, exports.intervalTimer)({ body: { roomId } }, null);
        }
        // Сценарий: если все пользователи покинули комнату
        if (roomUsers.every((user) => user.isUserLeave)) {
            if (timers[roomId]) {
                clearTimeout(timers[roomId].wordTimer);
                clearTimeout(timers[roomId].roundTimer);
                clearTimeout(timers[roomId].inactiveTimeout);
                delete timers[roomId];
            }
            yield roomModel_1.RoomModel.deleteOne({ roomId });
            console.log("Room deleted because all users left");
            return { message: "All users left, room deleted" };
        }
        // Сценарий: если хост покинул комнату
        if (updatedRoomData.host.hostId === userId) {
            console.log("Host left the room");
            const nextHost = remainUsers[0];
            if (nextHost) {
                yield roomModel_1.RoomModel.findOneAndUpdate({ roomId }, {
                    $set: {
                        host: {
                            hostName: nextHost.userName,
                            hostId: nextHost.userId,
                        },
                    },
                });
            }
        }
        // Уведомление о выходе пользователя
        yield server_1.io.to(roomId).emit("getUserLeft", {
            roomId,
            userName: userId,
            roomUsers: remainUsers,
            host: remainUsers[0],
        });
        return { message: "User left the room" };
    }
    catch (error) {
        console.error("Error in userLeavesRoom:", error);
        return { message: "Error in userLeavesRoom operation" };
    }
});
exports.userLeavesRoom = userLeavesRoom;
const updateUserState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = yield req.body.roomId;
    const userId = yield req.body.userId;
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
        const bulkWriteResult = yield roomModel_1.RoomModel.bulkWrite(bulkOperations, {
            ordered: true,
        });
        const updatedRoomData = yield roomModel_1.RoomModel.findOne({ roomId });
        return res.status(200).json({
            message: "user state upgraded with no error",
            roomUsers: updatedRoomData === null || updatedRoomData === void 0 ? void 0 : updatedRoomData.usersInfo.filter((user) => !user.isUserLeave),
        });
    }
});
exports.updateUserState = updateUserState;
const userTimeouts = new Map(); // Хранит таймеры для каждого пользователя
const Ping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, roomId } = req.body;
    if (!userId || !roomId) {
        return res.status(400).send("userId and roomId are required");
    }
    const roomData = yield roomModel_1.RoomModel.findOne({ roomId });
    if (!roomData) {
        return res.status(404).send("Room not found");
    }
    const currentUser = yield (roomData === null || roomData === void 0 ? void 0 : roomData.usersInfo.find((user) => {
        return user.userId === userId;
    }));
    const roomUsers = (yield (roomData === null || roomData === void 0 ? void 0 : roomData.usersInfo)) || [];
    const remainUsers = roomUsers.filter((user) => !user.isUserLeave);
    if (remainUsers.length === 1) {
        return res.status(400).json({ message: "User left the room" });
    }
    const userRoomKey = `${roomId}-${userId}`; // Создаем уникальный ключ для пользователя в комнат
    if ((currentUser && !roomData) ||
        (!roomData && currentUser && currentUser.isUserLeave)) {
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
    const timeoutId = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`User ${userId} is inactive for too long. Taking action in ROOM ${roomId}`);
        yield (0, exports.userLeavesRoom)(roomId, userId);
    }), 20000);
    userTimeouts.set(userRoomKey, timeoutId);
    res.send("Ping received");
});
exports.Ping = Ping;
// Запуск функции проверки таймеров
