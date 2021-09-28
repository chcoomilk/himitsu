import { useContext, useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import { useHistory } from "react-router";
import { FindNotePath, NewNotePath } from "../utils/constants";
import { StoreContext } from "../utils/context";

const Home = () => {
  const history = useHistory();
  const { setShowHomeLogo } = useContext(StoreContext);

  useEffect(() => {
    setShowHomeLogo(false);
    return () => {
      setShowHomeLogo(true);
    }
  }, [setShowHomeLogo]);

  return <>
      <h1>himitsu</h1>
      <p>Onii-chan's simple, secure, and private ( ͡° ͜ʖ ͡°) note sharing web app</p>
      <Stack direction="horizontal" className="mx-auto" gap={3}>
        <Button
          size="lg"
          variant="success"
          onClick={(e) => {
            e.preventDefault();
            history.push(NewNotePath);
          }}>Add</Button>
        <Button
          size="lg"
          onClick={(e) => {
          e.preventDefault();
          history.push(FindNotePath);
        }}>Find</Button>
      </Stack>
  </>
};

export default Home;
