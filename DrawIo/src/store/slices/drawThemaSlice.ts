import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawThemaState {
  isUserInLobbdy: boolean;
  currentRoom: string | null;
  userName: string;
  isDrawing: boolean;
  currentWord: string;
  score: number;
  players: Array<{
    id: string;
    name: string;
    score: number;
  }>;
}

const initialState: DrawThemaState = {
  isUserInLobbdy: false,
  currentRoom: null,
  userName: '',
  isDrawing: false,
  currentWord: '',
  score: 0,
  players: [],
};

const drawThemaSlice = createSlice({
  name: 'drawThema',
  initialState,
  reducers: {
    setIsUserInLobbdy: (state, action: PayloadAction<boolean>) => {
      state.isUserInLobbdy = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },
    setCurrentWord: (state, action: PayloadAction<string>) => {
      state.currentWord = action.payload;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    setPlayers: (state, action: PayloadAction<Array<{ id: string; name: string; score: number }>>) => {
      state.players = action.payload;
    },
    updatePlayerScore: (state, action: PayloadAction<{ id: string; score: number }>) => {
      const player = state.players.find(p => p.id === action.payload.id);
      if (player) {
        player.score += action.payload.score;
      }
    },
  },
});

export const {
  setIsUserInLobbdy,
  setCurrentRoom,
  setUserName,
  setIsDrawing,
  setCurrentWord,
  updateScore,
  setPlayers,
  updatePlayerScore,
} = drawThemaSlice.actions;

export default drawThemaSlice.reducer;
