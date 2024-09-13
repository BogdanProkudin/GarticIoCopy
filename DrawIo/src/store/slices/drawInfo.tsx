import { createSlice } from "@reduxjs/toolkit";

interface IDrawInfo {
  activeTool: string; //1
  drawColor: string; //2

  brushWidth: string; //3
  toolsPanel: boolean; //4
}

const initialState: IDrawInfo = {
  activeTool: "pen",
  drawColor: "black",

  brushWidth: "5",
  toolsPanel: false,
};

// Создание среза
const drawinfoSlice = createSlice({
  name: "drawInfo",
  initialState,
  reducers: {
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
    },
    setDrawColor: (state, action) => {
      state.drawColor = action.payload;
    },
    setBrushWidth: (state, action) => {
      state.brushWidth = action.payload;
    },
    setToolsPanel: (state, action) => {
      state.toolsPanel = action.payload;
    },
  },
});

export const { setActiveTool, setBrushWidth, setDrawColor, setToolsPanel } =
  drawinfoSlice.actions;
export default drawinfoSlice.reducer;
