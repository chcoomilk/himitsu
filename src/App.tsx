import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import HomeIcon from "./home.png";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IsHome } from "./utils/contexts";
import { NewNotePath, FindNotePath, HomePath } from "./utils/constants";

const Home = lazy(() => import("./pages/Home"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const FindNote = lazy(() => import("./pages/notes/FindNote"));

function App() {
  const [isHome, setIsHome] = useState<boolean>(false);

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <IsHome.Provider
            value={{ isHome, setIsHome }}
          >
            {
              isHome
                ? null
                : <Navbar fixed="top" className="px-3">
                  <Navbar.Brand>
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
                </Navbar>
            }

            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path={HomePath} component={Home} />
                <Route exact path={NewNotePath} component={NewNote} />
                <Route exact path={FindNotePath} component={FindNote} />
              </Switch>
            </Suspense>
          </IsHome.Provider>
        </Router>
      </header>
    </div>
  );
}

export default App;
