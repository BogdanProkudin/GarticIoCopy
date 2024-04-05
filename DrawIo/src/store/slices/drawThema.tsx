import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roomDataProps } from "../../components/setUpPage/setUpGameThema/setUpGameThemaStartButton";
import axios from "axios";
import { socket } from "../../socket";

interface initialStateProps {
  selectedThema: { name: string; icon: string; words: string[] };
  selectedPoints: number;
  selectedPlayers: number;
  roomData: any;
  roomUsers: any;
  host: string;
  activeUser: any;
  activeIndex: number;
  isGameStarted: boolean;
  choosedWord: string;
  isUserDraw: boolean;
  isRoundEnd: boolean;
  isAllUsersGuessed: boolean;
  isOneUserGuessed: boolean;
}

const initialState: initialStateProps = {
  selectedThema: { name: "", icon: "", words: [] },
  selectedPoints: 70,
  selectedPlayers: 5,
  roomData: [],
  roomUsers: [],
  host: "",
  activeUser: {},
  activeIndex: 0,
  isGameStarted: false,
  choosedWord: "",
  isUserDraw: false,
  isRoundEnd: false,
  isAllUsersGuessed: false,
  isOneUserGuessed: false,
};
export const createRoom = createAsyncThunk(
  "drawThema/createRoom",
  async function ({
    host,
    usersInfo,
    players,
    points,
    thema,
    roomId,
  }: roomDataProps) {
    try {
      const roomData = {
        host: host,
        usersInfo: usersInfo,
        players: players,
        points: points,
        roomId: roomId,
        thema: thema,
      };
      const response = await axios.post(
        "http://localhost:3000/createRoom",
        roomData
      );
      return response.data; // Возвращаем только данные из ответа
    } catch (err) {
      console.log("ERROR WHEN FETCHING AnimeData :", err);
      throw err; // Пробрасываем ошибку дальше для обработки в компоненте
    }
  }
);

export const getRoomData = createAsyncThunk(
  "drawThema/getRoomData",
  async function (roomId: string) {
    try {
      const response = await axios.get(
        `http://localhost:3000/getRoomData?q=${roomId}`
      );
      return response.data;
    } catch (err) {
      console.log("ERROR WHEN getting Room data :", err);
    }
  }
);
export const handleleaveRoom = createAsyncThunk(
  "drawThema/leaveRoom",
  async function ({
    roomId,
    userName,
  }: {
    roomId: string;
    userName: string | null;
  }) {
    try {
      const response = await axios.post(`http://localhost:3000/leaveRoom`, {
        roomId,
        userName,
      });
      console.log(response.data);
      socket.emit("leaveRoom", { roomId, userName });
      return response.data.roomData.usersInfo;
    } catch (err) {
      console.log("ERROR WHEN getting Room data :", err);
    }
  }
);

// Создание среза
const drawThemaSlice = createSlice({
  name: "drawThema",
  initialState,
  reducers: {
    setSelectedThema: (state, action) => {
      state.selectedThema = action.payload;
    },
    setSelectedPoints: (state, action) => {
      state.selectedPoints = action.payload;
    },
    setSelectedPlayers: (state, action) => {
      state.selectedPlayers = action.payload;
    },
    setRoomData: (state, action) => {
      state.roomData = action.payload;
    },
    setRoomUsers: (state, action) => {
      state.roomUsers = action.payload;
    },
    setHost: (state, action) => {
      state.host = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setIsGameStarted: (state, action) => {
      state.isGameStarted = action.payload;
    },
    setChoosedWord: (state, action) => {
      state.choosedWord = action.payload;
    },
    setIsUserDraw: (state, action) => {
      state.isUserDraw = action.payload;
    },
    setIsRoundEnd: (state, action) => {
      state.isRoundEnd = action.payload;
    },
    setIsAllUsersGuessed: (state, action) => {
      state.isAllUsersGuessed = action.payload;
    },
    setIsOneUserGuessed: (state, action) => {
      state.isOneUserGuessed = action.payload;
    },
  },
});

export const {
  setSelectedThema,
  setSelectedPlayers,
  setSelectedPoints,
  setRoomData,
  setRoomUsers,
  setHost,
  setActiveUser,
  setActiveIndex,
  setIsGameStarted,
  setChoosedWord,
  setIsUserDraw,
  setIsRoundEnd,
  setIsAllUsersGuessed,
  setIsOneUserGuessed,
} = drawThemaSlice.actions;
export default drawThemaSlice.reducer;
