import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch } from "react-router-dom";
import { match } from "react-router";
import { Navbar, Nav, Spinner, Alert } from "react-bootstrap";
import HomeIcon from "./media/home.png";
import { StoreContext } from "./utils/context";
import { AboutPath, NewNotePath, FindNotePath, HomePath, NotePath } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import './stylings/App.scss';
import { ErrorKind } from "./utils/types";

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
    fieldError: [],
  });

  return (
    <div className="App">
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

            <Navbar fixed="top" variant="dark" className="px-3 align-center">
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
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end text-white">
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
            </Navbar>

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
              Wrong password, Try Again!
            </Alert>

            <Alert
              variant="secondary"
              show={alerts.serverError} onClose={() => setAlerts((previousValue) => {
                return { ...previousValue, serverError: false };
              })}
              dismissible
            >
              Oops, seems like our server is having some problems
            </Alert>

            <Alert
              variant="danger"
              show={!!alerts.fieldError.length} onClose={() => setAlerts((previousValue) => {
                return { ...previousValue, fieldError: [] };
              })}
              dismissible
            >
              Invalid input on: {alerts.fieldError.join(", ")}
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
          </QueryClientProvider>

        </StoreContext.Provider>
      </Router>
    </div >
  );
}

export default App;
