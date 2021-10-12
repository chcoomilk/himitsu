import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch } from "react-router-dom";
import { match } from "react-router";
import { Navbar, Nav, Spinner, Alert, Container } from "react-bootstrap";
import HomeIcon from "./media/home.png";
import { StoreContext } from "./utils/context";
import { AboutPath, NewNotePath, FindNotePath, HomePath, NotePath } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { ErrorKind } from "./utils/types";
import './stylings/App.scss';

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
          <Navbar expand="lg" variant="dark">
            <Container>
              {
                showHomeLogo
                  ? <Navbar.Brand style={{ paddingLeft: "5px" }}>
                    <Link to={HomePath}>
                      <img
                        src={HomeIcon}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                      />
                    </Link>
                  </Navbar.Brand>
                  : null
              }
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse className="justify-content-end text-white">
                <Nav className="me-auto"></Nav>
                <Nav>
                  <Nav.Link
                    as={NavLink}
                    to={AboutPath}
                    activeStyle={{
                      textDecorationLine: "underline"
                    }}
                    isActive={(match: match | null) => !match ? false : true}
                  >About
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container className="page-content">
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
                Woah, sorry!
              </Alert.Heading>
              <p>
                Server seems to have some problems, please try again later.
              </p>
            </Alert>

            <Suspense fallback={
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            }>
              <Switch>
                <Route exact path={HomePath} component={Home} />
                <Route exact path={AboutPath} component={About} />
                <Route exact path={NewNotePath} component={NewNote} />
                <Route exact path={FindNotePath} component={FindNote} />
                <Route exact path={NotePath} component={Note} />
                <Redirect to={HomePath} />
              </Switch>
            </Suspense>
          </Container>
        </QueryClientProvider>
      </StoreContext.Provider>
    </Router>
  );
}

export default App;
