import { useParams } from "react-router";
import BackendEncryptedNote from "./BackendEncryptedNote";
import PlainNote from "./PlainNotes";

interface Params {
  id: string;
}

const Note = () => {
  const { id }: Params = useParams();

  if (isNaN(+id)) {
    return <PlainNote id={id} />;
  } else {
    return <BackendEncryptedNote id={+id} />;
  }
};

export default Note;
