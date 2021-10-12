import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { DefaultValue } from "../../utils/constants";
import { StoreContext } from "../../utils/context";
import BackendEncryptedNote from "./BackendEncryptedNote";
import PlainNote from "./PlainNotes";

interface Params {
  id: string;
}

const Note = () => {
  const { id }: Params = useParams();
  const { setAlerts } = useContext(StoreContext);

  useEffect(() => {
    return () => {
      setAlerts(DefaultValue.ErrorKind);
    };
  }, [setAlerts]);

  if (isNaN(+id)) {
    return <PlainNote id={id} />;
  } else {
    return <BackendEncryptedNote id={+id} />;
  }
};

export default Note;
