import { initialStateProps } from "../../store/slices/roomInfo";

interface IdrawThema {
  drawThema: initialStateProps;
}

const boardWaitstate = {
  drawThema: {
    roomUsers: [
      { id: "1", userName: "owner", isActive: false },
      { id: "2", userName: "owner2", isActive: false },
    ],
    host: "owner",
    activeIndex: 0,
    selectedThema: {
      name: "Животные",
      icon: "",
      words: ["собака", "крокодил"],
    },
  },
};

const boardState = {
  drawThema: {
    selectedThema: { name: "", icon: "", words: [] },
    selectedPoints: 70,
    selectedPlayers: 5,
    roomData: {
      id: "",
      host: "",
      players: 0,
      points: 0,
      thema: {
        icon: "",
        name: "",
        words: [],
      },
      usersInfo: [],
    },
    roomUsers: [],
    host: "",
    activeUser: {
      host: "",
      userName: "",
      userId: "",
      userAvatar: "",
      isActive: false,
      userPoints: 0,
    },
    maxRoomPoints: 0,
    roundCount: 0,
    activeIndex: 0,
    isGameStarted: false,
    choosedWord: "",
    isUserDraw: false,
    isRoundEnd: false,
    isUserWonGame: false,
    isAllUsersGuessed: false,
    isOneUserGuessed: false,
    chosenWords: [],
    activeTool: "",
    drawColor: "black",
    brushWidth: "5",
    toolsPanel: false,
    winners: [
      {
        isActive: false,
        userAvatar: "",
        userName: "",
        userPoints: 0,
      },
    ],
  },
};

export const testUseBoardWaitSelector = (
  f: (arg0: {
    drawThema: {
      roomUsers: { id: string; userName: string; isActive: boolean }[];
      host: string;
      activeIndex: number;
      selectedThema: { name: string; icon: string; words: string[] };
    };
  }) => any
) => f(boardWaitstate);

export const testUseBoardSelector = (f: IdrawThema | any) => {
  return f(boardState);
};
