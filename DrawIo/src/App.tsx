import { Suspense, lazy, Component, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteMiddleware from "./utils/RouteMiddleware";
import Loading from "./components/LoadingGame/Loading";
import ErrorBoundary from "./utils/ErrorBoundary";
import "./globalStyles.css";
// Lazy load components
const WelcomePage = lazy(() => import("./components/welcomePage/WelcomePage"));
const GameRoom = lazy(() => import("./components/gameRoom/gameRoom"));
const SetUpPage = lazy(() => import("./components/setUpPage/setUpPage"));
const GameRoom123 = lazy(() => import("./components/Board/ChooseWord"));
const LobbyNotFound = lazy(
  () => import("./components/lobbyNotFound/lobbyNotFound")
);
const PrepareGameRoom = lazy(
  () => import("./components/prepareGameRoom.tsx/prepareGameRoom")
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RouteMiddleware>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="game/:id" element={<GameRoom />} />
              <Route path="create" element={<SetUpPage />} />
              <Route path="123" element={<GameRoom123 />} />
              <Route path="lobbyNotFound" element={<LobbyNotFound />} />
              <Route path="prepareRoom/:id" element={<PrepareGameRoom />} />
            </Routes>
          </Suspense>
        </RouteMiddleware>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
