import { useEffect } from "react";
import { Alert, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Popup } from "../utils/types";

interface Props {
  popups: Popup,
  setPopups: React.Dispatch<React.SetStateAction<Popup>>,
}

const Popups = ({ popups, setPopups }: Props) => {
  const MULTIPLIER = 2;

  useEffect(() => {
    if (popups.passphraseNotRequired) {
      let timer = setTimeout(() => {
        setPopups(prev => {
          return {
            ...prev,
            passphraseNotRequired: false,
          }
        });
      }, 1500 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [popups.passphraseNotRequired, setPopups]);

  useEffect(() => {
    if (popups.wrongPassphrase) {
      let timer = setTimeout(() => {
        setPopups(prev => {
          return {
            ...prev,
            wrongPassphrase: false,
          }
        });
      }, 2000 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [popups.wrongPassphrase, setPopups]);

  useEffect(() => {
    if (popups.noteDeletion) {
      let timer = setTimeout(() => {
        setPopups(prev => {
          return {
            ...prev,
            noteDeletion: null,
          }
        });
      }, 2000 * MULTIPLIER);
      return () => clearTimeout(timer);
    }
  }, [popups.noteDeletion, setPopups]);

  return (
    <Container as={Col} xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }} className="himitsu-popups">
      <Alert
        variant="success"
        show={!!popups.noteDeletion} onClose={() => setPopups((previousValue) => {
          return { ...previousValue, noteDeletion: null };
        })}
        dismissible
      >
        <Alert.Heading>
          <i className="bi bi-check-lg"></i> {" "}
          Successfully deleted ID: {popups.noteDeletion}
        </Alert.Heading>
        <p>
          Well boys, we did it, racism is no more
        </p>
      </Alert>

      <Alert
        variant="info"
        show={popups.notFound} onClose={() => setPopups((previousValue) => {
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
          <Link id="special-alert-link" to="/find" onClick={() => setPopups((previousValue) => {
            return { ...previousValue, notFound: false };
          })}>
            Try Again
          </Link>?
        </p>
      </Alert>

      <Alert
        variant="info"
        show={popups.passphraseNotRequired} onClose={() => setPopups((previousValue) => {
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
        show={popups.wrongPassphrase} onClose={() => setPopups((previousValue) => {
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
        show={popups.serverError} onClose={() => setPopups((previousValue) => {
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
    </Container>
  );
};

export default Popups;
