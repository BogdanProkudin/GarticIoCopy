export const GAME_CONSTANTS = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 2,
  ROUND_TIME: 80,
  WORD_SELECTION_TIME: 15,
  SCORE_PER_CORRECT_GUESS: 100,
  SCORE_FOR_DRAWER: 50,
  MAX_ROUNDS: 3,
} as const;

export const CANVAS_SETTINGS = {
  DEFAULT_LINE_WIDTH: 5,
  DEFAULT_COLOR: '#000000',
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  BACKGROUND_COLOR: '#ffffff',
} as const;

export const SOCKET_EVENTS = {
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  START_GAME: 'startGame',
  DRAWING: 'drawing',
  GUESS_WORD: 'guessWord',
  WORD_GUESSED: 'wordGuessed',
  GAME_STATE_UPDATE: 'gameStateUpdate',
  ROUND_END: 'roundEnd',
  GAME_END: 'gameEnd',
} as const;

export const ERROR_MESSAGES = {
  ROOM_FULL: 'This room is full',
  GAME_IN_PROGRESS: 'Game is already in progress',
  INVALID_WORD: 'Invalid word selected',
  CONNECTION_ERROR: 'Connection error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;
