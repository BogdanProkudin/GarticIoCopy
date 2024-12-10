import { configureStore } from "@reduxjs/toolkit";

import drawThemaReducer from "./slices/drawThemaSlice";

export const store = configureStore({
  reducer: {
    drawThema: drawThemaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
