import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/userAuth";
import drawThema from "./slices/drawThema";
export const store = configureStore({
  reducer: { userAuth: userAuth, drawThema: drawThema },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
