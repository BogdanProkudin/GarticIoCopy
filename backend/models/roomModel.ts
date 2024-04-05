import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  host: { type: String, require: true },
  points: { type: Number, require: true },
  players: { type: Number, require: true },
  thema: {
    name: { type: String, require: true },
    words: [{ type: String, required: true }],
    icon: { type: String, require: true },
  },
  roomId: { type: String, require: true },
  usersInfo: [{ type: Object, required: true }],
});

export const RoomModel = mongoose.model("Room", roomSchema);
