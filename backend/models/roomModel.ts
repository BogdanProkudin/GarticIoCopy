import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
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
  usersLeftCount: { type: Number, require: true },
});

export const RoomModel = mongoose.model("Room", roomSchema);
