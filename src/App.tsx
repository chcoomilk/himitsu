import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import HomeIcon from "./home.png";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IsHome } from "./utils/contexts";

const Home = lazy(() => import("./pages/Home"));
const NewNote = lazy(() => import("./pages/notes/NewNote"));

function App() {
  const [isHome, setIsHome] = useState<boolean>(true);

  const toggleHome = (val: boolean) => {
    setIsHome(val);
  };

  return (
    <div className="App">
      <Router>
        <IsHome.Provider
          value={{ isHome, toggleHome }}
        >
          {
            isHome
              ? null
              : <Navbar fixed="top" className="px-3">
                <Navbar.Brand>
                  <Link to="/">
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
              <Route exact path="/" component={Home} />
              <Route exact path="/new-note" component={NewNote} />
            </Switch>
          </Suspense>
        </IsHome.Provider>
      </Router>
    </div>
  );
}

export default App;
