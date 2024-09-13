import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roomDataProps } from "../../components/setUpPage/setUpGameThema/setUpGameThemaStartButton";
import axios from "axios";
import { socket } from "../../socket";
export interface IActiveUser {
  userName: string;
  userId: string;
  host?: string;
  userAvatar: string;
  isActive: boolean;
  userPoints: number;
  addedPoints: number;
}
export interface IRoomUsers {
  isActive: boolean;
  userAvatar: string;
  userName: string;
  userPoints: number;
  isInGame?: boolean;
  addedPoints: number;
  isUserInLobby: boolean;
  isUserLeave: boolean;
}
interface IRoomThema {
  icon: string;
  name: string;
  words: string[];
}
export interface IRoomData {
  id: string;
  host: string;
  players: number;
  points: number;
  thema: IRoomThema;
  usersInfo: IRoomUsers[];
  isGameStarted: false;
}
export interface initialStateProps {
  selectedThema: { name: string; icon: string; words: string[] };
  selectedPoints: number;
  selectedPlayers: number;
  roomData: IRoomData;
  roomUsers: IRoomUsers[];
  host: { hostName: string; hostId: string };
  activeUser: IActiveUser;
  activeIndex: number;
  roundCount: number;
  isGameStarted: boolean;
  isPointsAnimation: {
    action: boolean;
    userName: string;
    guessedUserPoints: number;
    activeUserPoints: number;
  };

  choosedWord: string;
  choosedWordsList: string[];

  isRoundEnd: boolean;

  chosenWords: string[];

  winners: IRoomUsers[];
  maxRoomPoints: number;
  isGameRoomLoading: boolean;
  usersGuessed: string[];
  isIntervalOver: boolean;
  isRoundTimerOver: boolean;
  isUserInLobbdy: boolean;
}

const initialState: initialStateProps = {
  selectedThema: { name: "", icon: "", words: [] },
  selectedPoints: 70,
  selectedPlayers: 5,
  roomData: {
    id: "",
    host: "",
    players: 0,
    points: 0,
    thema: {
      icon: "",
      name: "",
      words: [],
    },
    usersInfo: [],
    isGameStarted: false,
  },
  roomUsers: [],
  host: { hostName: "", hostId: "" },
  activeUser: {
    host: "",
    userName: "",
    userId: "",
    userAvatar: "",
    isActive: false,
    userPoints: 0,
    addedPoints: 0,
  },
  maxRoomPoints: 0,
  isPointsAnimation: {
    action: false,
    userName: "",
    guessedUserPoints: 0,
    activeUserPoints: 0,
  },
  roundCount: 0,
  activeIndex: 0,
  isGameStarted: false,
  choosedWord: "",
  choosedWordsList: [],
  isGameRoomLoading: false,
  isRoundEnd: false,

  chosenWords: [],
  usersGuessed: [],
  winners: [
    {
      isActive: false,
      userAvatar: "",
      userName: "",
      userPoints: 0,
      addedPoints: 0,
      isUserInLobby: false,
      isUserLeave: false,
    },
  ],
  isIntervalOver: false,
  isRoundTimerOver: false,
  isUserInLobbdy: false,
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
  async function ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string | null;
  }) {
    try {
      console.log("пытаюсь гет рум дата");

      const response = await axios.get(`http://localhost:3000/getRoomData`, {
        params: { roomId, userId },
        headers: {
          "Cache-Control": "no-cache",
        },
      });
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
    setChoosedWordsList: (state, action) => {
      state.choosedWordsList = action.payload;
    },

    setIsRoundEnd: (state, action) => {
      state.isRoundEnd = action.payload;
    },

    setChosenWords: (state, action) => {
      state.chosenWords = action.payload;
    },

    setWinners: (state, action) => {
      state.winners = action.payload;
    },
    setRoundCount: (state) => {
      state.roundCount += 1;
    },

    setMaxRoomPoints: (state, action) => {
      state.maxRoomPoints = action.payload;
    },
    setIsPointAnimation: (state, action) => {
      state.isPointsAnimation = action.payload;
    },
    resetGameState(state) {
      return initialState;
    },

    setIsUserInLobbdy: (state, action) => {
      state.isUserInLobbdy = action.payload;
    },
    setIsIntervalOver: (state, action) => {
      state.isIntervalOver = action.payload;
    },
    setIsRoundTimerOver: (state, action) => {
      state.isRoundTimerOver = action.payload;
    },
    setUsersGuessed: (state, action) => {
      state.usersGuessed = action.payload;
    },
    setIsGameRoomLoading: (state, action) => {
      state.isGameRoomLoading = action.payload;
    },
  },
});
export const selectActiveUser = (state: { drawThema: { activeUser: any } }) =>
  state.drawThema.activeUser;
export const selectRoomUsers = (state: { drawThema: { roomUsers: any } }) =>
  state.drawThema.roomUsers;
export const selectRoundCount = (state: { drawThema: { roundCount: any } }) =>
  state.drawThema.roundCount;
export const selectMaxRoomPoints = (state: {
  drawThema: { maxRoomPoints: any };
}) => state.drawThema.maxRoomPoints;
export const selectActiveTool = (state: { drawThema: { activeTool: any } }) =>
  state.drawThema.activeTool;
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
  setIsGameRoomLoading,
  setChoosedWord,
  setIsRoundEnd,
  setChosenWords,
  setWinners,
  resetGameState,
  setRoundCount,
  setMaxRoomPoints,
  setChoosedWordsList,
  setIsPointAnimation,
  setUsersGuessed,
  setIsUserInLobbdy,
  setIsIntervalOver,
  setIsRoundTimerOver,
} = drawThemaSlice.actions;
export default drawThemaSlice.reducer;
