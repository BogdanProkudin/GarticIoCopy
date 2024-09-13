import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/userAuth";
import drawThema from "./slices/roomInfo";
import userInfo from "./slices/userInfo";
import drawInfo from "./slices/drawInfo";
export const store = configureStore({
  reducer: {
    userAuth: userAuth,
    drawThema: drawThema,
    userInfo: userInfo,
    drawInfo: drawInfo,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
