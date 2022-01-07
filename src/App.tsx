import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Alert, Container } from "react-bootstrap";
import { StoreContext } from "./utils/context";
import { PATHS } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { ErrorKind } from "./utils/types";
import './stylings/App.scss';
import Navigation from "./components/Navigation";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const FindNote = lazy(() => import("./pages/notes/FindNote"));
const Note = lazy(() => import("./pages/notes/Note"));

const queryClient = new QueryClient();

function App() {
  const [showHomeLogo, setShowHomeLogo] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [alerts, setAlerts] = useState<ErrorKind>({
    notFound: false,
    serverError: false,
    wrongPassword: false,
  });

  return (
    <Router>
      <StoreContext.Provider
        value={{
          setShowHomeLogo: setShowHomeLogo,
          setPassword,
          alerts,
          setAlerts,
          password
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Navigation showHome={showHomeLogo} />
          <Container className="page-content py-5">
            <Alert
              variant="info"
              show={alerts.notFound} onClose={() => setAlerts((previousValue) => {
                return { ...previousValue, notFound: false };
              })}
              dismissible
            >
              <Alert.Heading>
                Note not found T_T
              </Alert.Heading>
              <p>
                Note doesn't exist, or perhaps it's past its expiration date, {" "}
                <Link id="special-alert-link" to="/find" onClick={() => setAlerts((previousValue) => {
                  return { ...previousValue, notFound: false };
                })}>
                  Try Again
                </Link>?
              </p>
            </Alert>

            <Alert
              variant="danger"
              show={alerts.wrongPassword} onClose={() => setAlerts((previousValue) => {
                return { ...previousValue, wrongPassword: false };
              })}
              dismissible
            >
              <Alert.Heading>
                Wrong password
              </Alert.Heading>
              <p>
                Your secret could not be decrypted, please try again!
              </p>
            </Alert>

            <Alert
              variant="secondary"
              show={alerts.serverError} onClose={() => setAlerts((previousValue) => {
                return { ...previousValue, serverError: false };
              })}
              dismissible
            >
              <Alert.Heading>
                Sorry!
              </Alert.Heading>
              <p>
                The server is unavailabe at the moment, please try again later.
              </p>
            </Alert>

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
                <Route path={PATHS.note_detail + "/:id"} element={<Note />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </Container>
        </QueryClientProvider>
      </StoreContext.Provider>
    </Router>
  );
}

export default App;
