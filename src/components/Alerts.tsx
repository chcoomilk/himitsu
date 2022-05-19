import { useEffect } from "react";
import { Alert, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert as AlertT } from "../utils/types";

interface Props {
  alerts: AlertT,
  setAlerts: React.Dispatch<React.SetStateAction<AlertT>>,
}

// type Keys = keyof AlertT;

const Alerts = ({
  alerts: {
    noteDownload,
    noteDelete,
    notFound,
    serverError,
    tooManyRequests,
    wrongPassphrase,
  },
  setAlerts,
}: Props) => {
  // const {
  //   noteDownload,
  //   noteDelete,
  //   notFound,
  //   serverError,
  //   tooManyRequests,
  //   wrongPassphrase,
  // } = alerts;
  // const setFalse = useCallback((type: Keys) => {
  //   alerts[type] = false;
  //   setAlerts(alerts);
  // }, [alerts, setAlerts]);

  useEffect(() => {
    if (wrongPassphrase !== null) {
      let timer = setTimeout(() => setAlerts(prev => {
        return {
          ...prev,
          wrongPassphrase: null,
        };
      }), 6000);
      // let timer = setTimeout(() => setFalse("wrongPassphrase"), 2500);
      return () => clearTimeout(timer);
    }
  }, [wrongPassphrase, setAlerts]);

  useEffect(() => {
    if (noteDelete !== null) {
      let timer = setTimeout(() => setAlerts(prev => {
        return {
          ...prev,
          noteDelete: null,
        };
      }), 5000);
      return () => clearTimeout(timer);
    }
  }, [noteDelete, setAlerts]);

  useEffect(() => {
    if (noteDownload !== null) {
      let timer = setTimeout(() => setAlerts(prev => {
        return {
          ...prev,
          noteDownload: null,
        };
      }), 5000);
      return () => clearTimeout(timer);
    }
  }, [noteDownload, setAlerts]);

  return (
    <Container as={Col} xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }} className="himitsu-popups">
      <Alert
        variant="primary"
        show={noteDownload !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, noteDownload: null };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-check"></i> {" "}
          Note {noteDownload ? `(${noteDownload})` : null} has been downloaded locally
        </Alert.Heading>
        <p>
          Ah yes that note, I remember it clearly. It was something about [REDACTED], ahaha such a good memory...
        </p>
      </Alert>

      <Alert
        variant="success"
        show={noteDelete !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, noteDelete: null };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-check-lg"></i> {" "}
          {
            // if null or empty str
            noteDelete
              ? `Successfully deleted note ID: ${noteDelete}`
              : "Note has been deleted"
          }
        </Alert.Heading>
        <p>
          Well boys, we did it, racism is no more
        </p>
      </Alert>

      <Alert
        variant="info"
        show={notFound !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, notFound: null };
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
            return { ...previousValue, notFound: null };
          })}>
            Try Again
          </Link>?
        </p>
      </Alert>

      <Alert
        variant="danger"
        show={wrongPassphrase !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, wrongPassphrase: null };
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
        show={serverError !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, serverError: null };
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
        show={tooManyRequests !== null} onClose={() => setAlerts((previousValue) => {
          return { ...previousValue, tooManyRequests: null };
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
