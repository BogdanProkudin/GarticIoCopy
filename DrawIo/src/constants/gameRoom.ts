export const PING_INTERVAL = 17000;

export const API_ENDPOINTS = {
  PING: "https://bottg-63go.onrender.com/ping",
  UPDATE_USER_STATE: "https://bottg-63go.onrender.com/updateUserState",
  USER_LEAVE_ROOM: "https://bottg-63go.onrender.com/userLeaveRoom",
  GET_ROOM_DATA: "https://bottg-63go.onrender.com/getRoomData",
} as const;

export const STYLES = {
  FONT_URL:
    "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap",
} as const;

export const MESSAGES = {
  LEAVE_PAGE_CONFIRMATION: "Вы уверены, что хотите покинуть эту страницу?",
  ROOM_NO_LONGER_EXISTS: "Room no longer exists",
  UPDATE_PAGE: "update page",
  INACTIVE_USER: "INACTIVE USER",
  USER_INACTIVE: "User is inactive for 1 minute",
} as const;
