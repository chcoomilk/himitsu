// import logo from '../logo.svg'; // chungga chngga want me own logo
import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { IsHome } from "../utils/contexts";

const Home = () => {
  const history = useHistory();
  const { toggleHome } = useContext(IsHome);

  useEffect(() => {
    toggleHome(true);
    return () => {
      toggleHome(false);
    }
  }, []);

  return <>
    <header className="App-header">
      <h1>himitsu</h1>
      <p>Onii-chan's simple, secure, and private ( ͡° ͜ʖ ͡°) note sharing web app</p>
      <div className="Home-buttons">
        <Button onClick={(e) => {
          e.preventDefault();
          history.push("/new-note");
        }}>Add</Button>
        <Button onClick={(e) => {
          e.preventDefault();
          history.push("/new-note");
        }}>Find</Button>
      </div>
    </header>
  </>
};

export default Home;
