import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { StoreContext } from "./utils/context";
import { BASE_URL, DefaultValue, PATHS } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { ErrorKind } from "./utils/types";

import "./stylings/index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-loading-skeleton/dist/skeleton.css'

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
// const Home = lazy(() => import("./pages/Home"));
const BasicAlerts = lazy(() => import("./components/BasicAlerts"))
const About = lazy(() => import("./pages/About"));
const Navigation = lazy(() => import("./components/Navigation"))
const Note = lazy(() => import("./pages/notes/Note"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        let url = BASE_URL + queryKey[0];

        let response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
        });

        return await response.json();
      }
    }
  }
});

function App() {
  const [password, setPassword] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<ErrorKind>({
    ...DefaultValue.Error,
  });

  return (
    <Router>
      <StoreContext.Provider
        value={{
          setPassword,
          alerts,
          setAlerts,
          password
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={
            <Spinner animation="border" role="status"
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                top: "50vh",
                left: 0,
                right: 0,
                textAlign: "center",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          }>
            <Navigation />
            <Container className="himitsu">
              <BasicAlerts alerts={alerts} setAlerts={setAlerts} />
              <Routes>
                <Route path={PATHS.home} element={<Home />} />
                <Route path={PATHS.about} element={<About />} />
                <Route path={PATHS.new_note} element={<NewNote />} />
                <Route path={PATHS.find_note} element={<FindNote />} />
                <Route path={PATHS.note_detail + "/:_id"} element={<Note />} />
                <Route path="*" element={
                  <Navigate to="/" />
                } />
              </Routes>
            </Container>
          </Suspense>
        </QueryClientProvider>
      </StoreContext.Provider >
    </Router >
  );
}

export default App;
