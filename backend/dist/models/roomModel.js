"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    host: { type: Object, require: true },
    points: { type: Number, require: true },
    players: { type: Number, require: true },
    thema: {
        name: { type: String, require: true },
        words: [{ type: String, required: true }],
        icon: { type: String, require: true },
    },
    activeUser: { type: Object, require: false },
    isGameStarted: { type: Boolean, require: true },
    roomId: { type: String, require: true },
    usersInfo: [{ type: Object, required: true }],
    gameWinners: [{ type: Object }],
    skippedRoundsinLine: { type: Number, require: true },
    isWordChosen: { type: Boolean },
    usersGuessedList: [{ type: Object }],
    isRoundOver: { type: Boolean },
    isUserNotGuessed: { type: Boolean },
    usersLeftCount: { type: Number, require: true },
});
exports.RoomModel = mongoose_1.default.model("Room", roomSchema);
