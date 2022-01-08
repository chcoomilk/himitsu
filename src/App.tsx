import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { StoreContext } from "./utils/context";
import { DefaultValue, PATHS } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { ErrorKind } from "./utils/types";
import Navigation from "./components/Navigation";
import BasicAlerts from "./components/BasicAlerts";

import './stylings/App.scss';

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const FindNote = lazy(() => import("./pages/notes/FindNote"));
const Note = lazy(() => import("./pages/notes/Note"));

const queryClient = new QueryClient();

function App() {
  const [password, setPassword] = useState("");
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
          <Navigation />
          <Container className="page-content">
            <BasicAlerts alerts={alerts} setAlerts={setAlerts} />
            <Suspense fallback={
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            }>
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
            </Suspense>
          </Container>
        </QueryClientProvider>
      </StoreContext.Provider>
    </Router>
  );
}

export default App;
