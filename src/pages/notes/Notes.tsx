import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import NotesTable from "../../components/note/NotesTable";
import { local_storage } from "../../utils/functions";
import { NoteInfo } from "../../utils/types";

const Notes = () => {
  const [notes, setNote] = useState<NoteInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notes = local_storage.get("notes");
    setNote(notes);
    setLoading(false);
  }, [setLoading, setNote]);

  return (
    <Container className="overflow-auto">
      {
        loading
          ? <Spinner animation="border" />
          : <NotesTable className="align-self-center" responsive striped bordered hover variant="dark" notes={notes} />
      }
    </Container>
  );
};

export default Notes;
