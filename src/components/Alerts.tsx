import { useEffect } from "react";
import { Alert, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert as AlertType } from "../utils/types";

interface Props {
  alerts: AlertType,
  setAlerts: React.Dispatch<React.SetStateAction<AlertType>>,
}

const Alerts = ({ alerts, setAlerts }: Props) => {
  const MULTIPLIER = 2;

  useEffect(() => {
    if (alerts.passphraseNotRequired) {
      let timer = setTimeout(() => {
        setAlerts(prev => {
          return {
            ...prev,
            passphraseNotRequired: false,
          }
        });
      }, 1500 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [alerts.passphraseNotRequired, setAlerts]);

  useEffect(() => {
    if (alerts.wrongPassphrase) {
      let timer = setTimeout(() => {
        setAlerts(prev => {
          return {
            ...prev,
            wrongPassphrase: false,
          }
        });
      }, 2000 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [alerts.wrongPassphrase, setAlerts]);

  useEffect(() => {
    if (alerts.noteDeletion) {
      let timer = setTimeout(() => {
        setAlerts(prev => {
          return {
            ...prev,
            noteDeletion: null,
          }
        });
      }, 2000 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [alerts.noteDeletion, setAlerts]);

  return (
    <Container as={Col} xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }} className="himitsu-popups">
      <Alert
        variant="success"
        show={!!alerts.noteDeletion} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, noteDeletion: null };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-check-lg"></i> {" "}
          Successfully deleted ID: {alerts.noteDeletion}
        </Alert.Heading>
        <p>
          Well boys, we did it, racism is no more
        </p>
      </Alert>

      <Alert
        variant="info"
        show={alerts.notFound} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, notFound: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-question-circle"></i> {" "}
          Note not found
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
        show={alerts.passphraseNotRequired} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, passphraseNotRequired: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-info-circle"></i> {" "}
          Passphrase was not required
        </Alert.Heading>
      </Alert>

      <Alert
        variant="danger"
        show={alerts.wrongPassphrase} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, wrongPassphrase: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-dash-circle"></i> {" "}
          Wrong passphrase
        </Alert.Heading>
        <p>
          Think Mark, thicc!
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
          Service is unresponsive at the moment, please try again later.
        </p>
      </Alert>

      <Alert
        variant="warning"
        show={alerts.tooManyRequests} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, tooManyRequests: false };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-pause-circle"></i> {" "}
          Slow down!
        </Alert.Heading>
        <p>
          You're not trying to break the fooken server, are'ya?.
        </p>
      </Alert>
    </Container>
  );
};

export default Alerts;
