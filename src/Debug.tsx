import { useContext } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "./utils/contexts";
import { Alert } from "./utils/types";

type AlertKeys = keyof Alert;
const createAlertKeys = <T extends AlertKeys[]>(
  ...array: T & ([AlertKeys] extends [T[number]] ? unknown : "Missing a key")
) => array;

const Debug = () => {
  const { setAlerts } = useContext(AppContext);
  return (
    <>
      {
        createAlertKeys(
          "clientError",
          "notFound",
          "noteDelete",
          "noteDownload",
          "serverError",
          "tooManyRequests",
          "wrongPassphrase",
        ).map(key => {
          return (
            <Button
              className="mb-3"
              key={key}
              onClick={_ => {
                setAlerts(alerts => {
                  alerts[key] = "";
                  return { ...alerts };
                });
              }}
            >
              {key}
            </Button>
          );
        })
      }
      <Button
        className="mb-3"
        onClick={_ => { }}
      >
        Toast
      </Button>
    </>
  );
};

export default Debug;
