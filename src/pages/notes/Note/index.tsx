import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation, Location } from "react-router-dom";
import { PATHS } from "../../../utils/constants";
import toast from "react-hot-toast";
import Note from "./pls help seperate T_T";

interface State {
  passphrase: string | null
}

interface ModifiedLocation extends Location {
  state: State | unknown
}

type DetermineProps = {
  id: null | string,
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
    if (typeof unchecked_id === "undefined" || unchecked_id.length > 32) {
      toast("id is not valid", {
        icon: <i className="bi bi-exclamation-circle-fill" />,
      });
      navigate(PATHS.find_note, { replace: true });
      return;
    }

    if (isPassphraseAvailable(state) && state.passphrase) {
      passphrase = state.passphrase;
    }

    setProps({ id: unchecked_id, passphrase });
  }, [state, navigate, setProps, unchecked_id]);

  if (props.id !== null) {
    return <Note checked_id={props.id} state_passphrase={props.passphrase} />;
  } else {
    return null;
  }
};

export default NotePage;
