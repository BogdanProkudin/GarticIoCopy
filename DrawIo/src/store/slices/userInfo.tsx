import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUserInfo {
  isAllUsersGuessed: boolean; // user
  isOneUserGuessed: boolean; //user
  isUserNotGuessedStarted: boolean; //user
  isUserWonGame: boolean;
  isUsersNotGuessed: boolean; //users
  isUserDraw: boolean; //user
}

const initialState: IUserInfo = {
  isUserWonGame: false,
  isUserNotGuessedStarted: false,
  isAllUsersGuessed: false,
  isOneUserGuessed: false,
  isUsersNotGuessed: false,
  isUserDraw: false,
};

// Создание среза
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setIsUsersNotGuessedStarted: (state, action) => {
      state.isUserNotGuessedStarted = action.payload;
    },
    setIsAllUsersGuessed: (state, action) => {
      state.isAllUsersGuessed = action.payload;
    },
    setIsOneUserGuessed: (state, action) => {
      state.isOneUserGuessed = action.payload;
    },
    setIsUserWonGame: (state, action) => {
      state.isUserWonGame = action.payload;
    },
    setIsUsersNotGuessed: (state, action) => {
      state.isUsersNotGuessed = action.payload;
    },
    setIsUserDraw: (state, action) => {
      state.isUserDraw = action.payload;
    },
  },
});

export const {
  setIsUsersNotGuessedStarted,
  setIsAllUsersGuessed,
  setIsUserWonGame,

  setIsOneUserGuessed,
  setIsUsersNotGuessed,
  setIsUserDraw,
} = userInfoSlice.actions;
export default userInfoSlice.reducer;
