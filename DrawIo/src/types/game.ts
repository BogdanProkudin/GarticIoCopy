export interface Player {
  id: string;
  name: string;
  score: number;
  isDrawing?: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  currentDrawer?: string;
  word?: string;
  status: 'waiting' | 'playing' | 'finished';
  roundTime: number;
  maxPlayers: number;
}

export interface DrawingData {
  x: number;
  y: number;
  type: 'start' | 'draw' | 'end';
  color?: string;
  lineWidth?: number;
  roomId: string;
}

export interface GameState {
  currentRoom: Room | null;
  isDrawing: boolean;
  currentWord: string;
  timeLeft: number;
  scores: Record<string, number>;
}

export type GameAction = 
  | { type: 'START_GAME'; payload: Room }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_SCORES'; payload: Record<string, number> }
  | { type: 'SET_WORD'; payload: string }
  | { type: 'SET_TIMER'; payload: number };
