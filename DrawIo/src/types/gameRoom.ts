import { Dispatch, SetStateAction } from "react";

export interface Winner {
  userPoints: number;
  userName: string;
  userId: string;
}

export interface User {
  userId: string;
  userName: string;
  isUserInLobby: boolean;
  userPoints: number;
}

export interface Host {
  hostName: string;
}

export interface GameRoomModalProps {
  showShareModal: boolean;
  showRulesModal: boolean;
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
  setShowRulesModal: Dispatch<SetStateAction<boolean>>;
}

export interface SideContentProps {
  width?: string;
  className: string;
}

export interface CanvasProps {
  contextRef: React.RefObject<any>;
  roomId: string;
  drawRef: React.RefObject<any>;
}
