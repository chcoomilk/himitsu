import { useEffect } from "react";
import { Alert, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ErrorKind } from "../utils/types";

interface Props {
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
}

const BasicAlerts = ({ alerts, setAlerts }: Props) => {
  useEffect(() => {
    if (alerts.passwordNotRequired === true) {
      let timer = setTimeout(() => {
        setAlerts(prev => {
          return {
            ...prev,
            passwordNotRequired: false,
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alerts.passwordNotRequired, setAlerts]);

  useEffect(() => {
    if (alerts.wrongPassword === true) {
      let timer = setTimeout(() => {
        setAlerts(prev => {
          return {
            ...prev,
            wrongPassword: false,
          }
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alerts.wrongPassword, setAlerts]);

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
          <i className="bi bi-question-circle"></i> {" "}
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
          <i className="bi bi-info-circle"></i> {" "}
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
          <i className="bi bi-dash-circle"></i> {" "}
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
          <i className="bi bi-cloud-slash"></i> {" "}
          Error Occurred
        </Alert.Heading>
        <p>
          The server is unavailabe at the moment, please try again later.
        </p>
      </Alert>
    </Container>
  );
};

export default BasicAlerts;
