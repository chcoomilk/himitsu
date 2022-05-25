import { Alert, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { Alert as AlertT } from "./utils/types";
import { unwrap } from "./utils/functions";

type AlertKeys = keyof AlertT;
const createAlertKeys = <T extends AlertKeys[]>(
  ...array: T & ([AlertKeys] extends [T[number]] ? unknown : "Missing a key")
) => array;

const Debug = () => {
  return (
    <>
      {
        createAlertKeys(
          "clientError",
          "notFound",
          "genericDelete",
          "genericSave",
          "serverError",
          "tooManyRequests",
          "wrongPassphrase",
        ).map(key => {
          return (
            <Button
              className="mb-3"
              key={key}
              onClick={_ => {
                unwrap.default(key);
              }}
            >
              {key}
            </Button>
          );
        })
      }
      <Button
        className="mb-3"
        onClick={_ => {
          toast((t) => (
            <Alert dismissible onClose={() => {
              toast.dismiss(t.id);
            }}>
              <Alert.Heading>
                Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello
              </Alert.Heading>
              <p>
                World World World World World World World Why Stack
              </p>
            </Alert>
          ), { duration: Infinity, className: "toast-alert" });
        }}
      >
        Toast
      </Button>
      <Alert dismissible onClose={() => {
      }}>
        <Alert.Heading>
          Hello
        </Alert.Heading>
        <p>
          World
        </p>
      </Alert>
    </>
  );
};

export default Debug;
