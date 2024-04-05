import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CounterState {
  userNameInputValue: string;
  isUserNameError: boolean;
  activeAvatar: string;
}

const initialState: CounterState = {
  userNameInputValue: "User6970",
  isUserNameError: false,
  activeAvatar: "https://gartic.io/static/images/avatar/svg/0.svg",
};

// Создание среза
const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserNameInputValue: (state, action: PayloadAction<string>) => {
      state.userNameInputValue = action.payload;
    },
    setIsUserNameError: (state, action: PayloadAction<boolean>) => {
      state.isUserNameError = action.payload;
    },
    setActiveAvatar: (state, action: PayloadAction<string>) => {
      state.activeAvatar = action.payload;
    },
  },
});

export const { setUserNameInputValue, setIsUserNameError, setActiveAvatar } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
