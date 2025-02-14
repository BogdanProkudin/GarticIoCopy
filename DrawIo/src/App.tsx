import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteMiddleware from "./utils/RouteMiddleware";
import Loading from "./components/LoadingGame/Loading";
import GameRoom from "./components/gameRoom/gameRoom";
import ErrorBoundary from "./utils/ErrorBoundary";
import "./globalStyles.css";
// Lazy load components
const WelcomePage = lazy(() => import("./components/welcomePage/WelcomePage"));

const SetUpPage = lazy(() => import("./components/setUpPage/setUpPage"));
const GameRoom123 = lazy(() => import("./components/Board/ChooseWord"));
const LobbyNotFound = lazy(
  () => import("./components/lobbyNotFound/lobbyNotFound")
);
const PrepareGameRoom = lazy(
  () => import("./components/prepareGameRoom.tsx/prepareGameRoom")
);

/**
 * The App component sets up the main routing structure for the application.
 * It wraps the routes within an ErrorBoundary and a Router, providing
 * a fallback loading component during lazy loading of components.
 *
 * Routes:
 * - "/" renders the WelcomePage component.
 * - "/game/:id" renders the GameRoom component, where :id is a dynamic segment.
 * - "/create" renders the SetUpPage component.
 * - "/123" renders the GameRoom123 component.
 * - "/lobbyNotFound" renders the LobbyNotFound component.
 * - "/prepareRoom/:id" renders the PrepareGameRoom component, where :id is a dynamic segment.
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RouteMiddleware>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
            </Routes>
          </Suspense>
          <Routes>
            <Route path="game/:id" element={<GameRoom />} />
            <Route path="create" element={<SetUpPage />} />
            <Route path="123" element={<GameRoom123 />} />
            <Route path="lobbyNotFound" element={<LobbyNotFound />} />
            <Route path="prepareRoom/:id" element={<PrepareGameRoom />} />
          </Routes>
        </RouteMiddleware>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
