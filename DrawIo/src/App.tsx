import Board from "./components/Board/Board";
import GameRoom123 from "./components/Board/ChooseWord";
import GameRoom from "./components/gameRoom/gameRoom";
import PrepareGameRoom from "./components/prepareGameRoom.tsx/prepareGameRoom";
import SetUpPage from "./components/setUpPage/setUpPage";
import WelcomePage from "./components/welcomePage/WelcomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="game/:id" element={<GameRoom />} />
        <Route path="create" element={<SetUpPage />} />
        <Route path="123" element={<GameRoom123 />} />
        <Route path="prepareRoom/:id" element={<PrepareGameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
