import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch } from "react-router-dom";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import HomeIcon from "./home.png";
import { StoreContext } from "./utils/context";
import { AboutPath, NewNotePath, FindNotePath, HomePath, NotePath } from "./utils/constants";
import './App.scss';

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const FindNote = lazy(() => import("./pages/notes/FindNote"));
const Note = lazy(() => import("./pages/notes/Note"));

function App() {
  const [showHomeLogo, setShowHomeLogo] = useState<boolean>(true);

  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <Router>
          <StoreContext.Provider
            value={{
              setShowHomeLogo: setShowHomeLogo
            }}
          >
            <Navbar fixed="top" variant="dark" className="px-3 align-center">
              {
                showHomeLogo
                  ? <Navbar.Brand>
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
                  <Nav.Link>
                    <NavLink
                      to={AboutPath}
                      style={{
                        textDecorationLine: "none",
                        color: "inherit",
                        paddingRight: "10px"
                      }}
                      activeStyle={{
                        textDecorationLine: "underline"
                      }}
                      isActive={(match) => !match ? false : true}
                    >About</NavLink>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>

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
          </StoreContext.Provider>
        </Router>
      {/* </header> */}
    </div>
  );
}

export default App;
