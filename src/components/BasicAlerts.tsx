import { Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ErrorKind } from "../utils/types";

interface Props {
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
}

const BasicAlerts = ({ alerts, setAlerts }: Props) => {
  return (
    <Container>
      <Alert
        variant="info"
        show={alerts.notFound} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, notFound: false };
        })}
        dismissible
      >
        <Alert.Heading>
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
