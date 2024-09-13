import GameRoom123 from "./components/Board/ChooseWord";
import GameRoom from "./components/gameRoom/gameRoom";

import PrepareGameRoom from "./components/prepareGameRoom.tsx/prepareGameRoom";
import SetUpPage from "./components/setUpPage/setUpPage";
import WelcomePage from "./components/welcomePage/WelcomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RouteMiddleware from "./utils/RouteMiddleware";
import LobbyNotFound from "./components/lobbyNotFound/lobbyNotFound";

// const RouteTracker = () => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const isUserInLobbdy = useAppSelector(
//     (state) => state.drawThema.isUserInLobbdy
//   );
//   useEffect(() => {
//     console.log("Current route:", location.pathname);
//     if (location.pathname.length !== 12 && isUserInLobbdy) {
//       console.log("вызываем функцию ");
//       dispatch(setIsUserInLobbdy(false));
//     } else {
//       console.log("не вызываем");
//     }
//     // Вы можете сохранять историю в массив или отправлять на сервер
//   }, [location]);

//   return null; // Компонент не рендерит ничего
// };ct";

function App() {
  return (
    <Router>
      <RouteMiddleware>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="game/:id" element={<GameRoom />} />
          <Route path="create" element={<SetUpPage />} />
          <Route path="123" element={<GameRoom123 />} />
          <Route path="lobbyNotFound" element={<LobbyNotFound />} />
          <Route path="prepareRoom/:id" element={<PrepareGameRoom />} />
        </Routes>
      </RouteMiddleware>
    </Router>
  );
}

export default App;
