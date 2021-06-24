import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import HomeIcon from "./home.png";
import { StoreContext } from "./utils/contexts";
import { AboutPath, NewNotePath, FindNotePath, HomePath, BaseUrl } from "./utils/constants";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from "axios";
import LoginRegisterModal from "./components/LoginRegisterModal";

const Home = lazy(() => import("./pages/Home"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const FindNote = lazy(() => import("./pages/notes/FindNote"));

function App() {
  const [show_login_register_modal, set_show_login_register_modal] = useState<boolean>(false);
  const [isHome, setIsHome] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  // const checkStatus = (): boolean => {
  //   if (!username) {
  //     set_show_login_register_modal(true);
  //     return false;
  //   }

  //   return true;
  // }

  const logout = () => {
    localStorage.removeItem("token");
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const fetchUsername = useCallback(async (token: string) => {
    try {
      let response = await axios.get<string>(BaseUrl + "/user/info", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setUsername(response.data);
      } else {
        // possible reason: invalid token
        logout();
      }
    } catch (error) {
      // possible reason: disconnected from server
      console.log(error);
    }
  }, [setUsername]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      fetchUsername(token);
    }
  }, [fetchUsername]);

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <StoreContext.Provider
            value={{
              isHome,
              setIsHome,
              login: {
                logout,
                setToken,
                showLoginModal: set_show_login_register_modal,
                username
              }
            }}
          >
            <LoginRegisterModal show={show_login_register_modal} />
            <Navbar fixed="top" variant="dark" className="px-3 align-center">
              {
                isHome
                  ? null
                  : <Navbar.Brand>
                    <Link to={HomePath}>
                      {"<"}
                      <img
                        src={HomeIcon}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                      />
                    </Link>
                  </Navbar.Brand>
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
                    >Info</NavLink>
                  </Nav.Link>
                  {
                    username
                      ? (
                        <Navbar.Text>
                          {username}
                        </Navbar.Text>
                      )
                      : (
                        <Nav.Link active={false} onClick={() => set_show_login_register_modal(true)}>
                          Login
                        </Nav.Link>
                      )
                  }
                </Nav>
              </Navbar.Collapse>
            </Navbar>

            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path={HomePath} component={Home} />
                <Route exact path={NewNotePath} component={NewNote} />
                <Route exact path={FindNotePath} component={FindNote} />
                <Route exact path={AboutPath} component={FindNote} />
              </Switch>
            </Suspense>
          </StoreContext.Provider>
        </Router>
      </header>
    </div>
  );
}

export default App;
