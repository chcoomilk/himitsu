// import logo from '../logo.svg'; // chungga chngga want me own logo
import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { FindNotePath, NewNotePath } from "../utils/constants";
import { Store } from "../utils/contexts";

const Home = () => {
  const history = useHistory();
  const { setIsHome } = useContext(Store);

  useEffect(() => {
    setIsHome(true);
    return () => {
      setIsHome(false);
    }
  }, [setIsHome]);

  return <>
    <header className="App-header">
      <h1>himitsu</h1>
      <p>Onii-chan's simple, secure, and private ( ͡° ͜ʖ ͡°) note sharing web app</p>
      <div className="Home-buttons">
        <Button
          variant="success"
          onClick={(e) => {
            e.preventDefault();
            history.push(NewNotePath);
          }}>Add</Button>
        <Button onClick={(e) => {
          e.preventDefault();
          history.push(FindNotePath);
        }}>Find</Button>
      </div>
    </header>
  </>
};

export default Home;
