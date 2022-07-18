import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useNavigate, useLocation, Location } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import toast from "react-hot-toast";
import Note from "./Note/";

interface State {
  passphrase: string | null
}

interface ModifiedLocation extends Location {
  state: State | unknown
}

type DetermineProps = {
  id: null | number,
  passphrase: null | string,
}

const NotePage = () => {
  let { id: unchecked_id } = useParams();
  const navigate = useNavigate();
  const { state }: ModifiedLocation = useLocation();
  const isPassphraseAvailable = (state: State | unknown): state is State => {
    return (state !== null && (state as State).passphrase !== undefined);
  }
  const [props, setProps] = useState<DetermineProps>({
    id: null,
    passphrase: null,
  });

  useEffect(() => {
    let passphrase: string | null = null;
    if (typeof unchecked_id === "undefined" || isNaN(+unchecked_id) || +unchecked_id === 0) {
      toast("id was not valid", {
        icon: <i className="bi bi-exclamation-circle-fill" />,
      });
      navigate(PATHS.find_note, { replace: true });
      return;
    }

    if (isPassphraseAvailable(state) && state.passphrase) {
      passphrase = state.passphrase;
    }

    setProps({ id: +unchecked_id, passphrase });
  }, [state, navigate, setProps, unchecked_id]);

  if (props.id !== null) {
    return <Note checked_id={props.id} state_passphrase={props.passphrase} />;
  } else {
    return <Spinner animation="border" role="status"
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        top: "50vh",
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>;
  }
};

export default NotePage;
