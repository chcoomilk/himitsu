import { useEffect } from "react";
import { Alert, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DefaultValue } from "../utils/constants";
import { ErrorKind } from "../utils/types";

interface Props {
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
}

const BasicAlerts = ({ alerts, setAlerts }: Props) => {
  useEffect(() => {
      let timer = setTimeout(() => {
      setAlerts(DefaultValue.Error);
    }, 5000);
    return () => clearTimeout(timer);
  }, [alerts, setAlerts]);

  return (
    <Container as={Col} xl={{ offset: 3, span: 6 }}>
      <Alert
        variant="info"
        show={alerts.notFound} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, notFound: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
          </svg> {" "}
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
        variant="info"
        show={alerts.passwordNotRequired} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, passwordNotRequired: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg> {" "}
          Password was not required
        </Alert.Heading>
      </Alert>

      <Alert
        variant="danger"
        show={alerts.wrongPassword} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, wrongPassword: false };
        })}
        dismissible
      >
        <Alert.Heading>
          Wrong password
        </Alert.Heading>
        <p>
          Your secret could not be decrypted, please try again!
        </p>
      </Alert>

      <Alert
        variant="secondary"
        show={alerts.serverError} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, serverError: false };
        })}
        dismissible
      >
        <Alert.Heading>
          Sorry!
        </Alert.Heading>
        <p>
          The server is unavailabe at the moment, please try again later.
        </p>
      </Alert>
    </Container>
  );
};

export default BasicAlerts;
