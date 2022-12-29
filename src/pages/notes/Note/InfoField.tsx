import { Col, Container, Placeholder } from "react-bootstrap";
import hljs from "highlight.js/lib/core";
import hs_json from "highlight.js/lib/languages/json";
import { Note, NoteInfo } from "../../../utils/types";
import { generate_face } from "../../../utils/functions";

hljs.registerLanguage("json", hs_json);

type Props = {
  note?: Note | NoteInfo,
  isLoading: boolean,
}

const isNote = (item: unknown): item is Note => !!(item as Note).raw;

const NoteInfoField = ({ note, isLoading }: Props) => {
  return (
    isLoading
      ? (
        <Container fluid className="hljs" style={{ padding: "1em" }} >
          <Placeholder animation="wave" children={
            <>
              <Placeholder xs="2" /> <Col />
              <Placeholder xs="3" className="ms-3" /> <Placeholder xs="4" /> <Col />
              <Placeholder xs="3" className="ms-5" /> <Placeholder xs="4" /> <Col />
              <Placeholder xs="2" className="ms-5" /> <Placeholder xs="5" /> <Col />
              <Placeholder xs="2" className="ms-3" /> <Placeholder xs="4" /> <Col />
              <Placeholder xs="3" className="ms-3" /> <Placeholder xs="5" /> <Col />
              <Placeholder xs="2" /> <Col />
            </>
          } />
        </Container >
      ) : (
        <pre className="hljs">
          {(!!note) ? (
            <code className="hljs" dangerouslySetInnerHTML={{
              __html: (
                hljs.highlight(JSON.stringify({
                  ...note,
                  passphrase: undefined,
                  content: undefined,
                  raw: isNote(note) ? {
                    ...note.raw,
                    content: undefined,
                  } : undefined
                }, undefined, "  "), { language: "json" }).value
              ),
            }}>
            </code>
          ) : (
            <code className="hljs text-center">
              {generate_face()}
            </code>
          )}
        </pre>
      )
  );
};

export default NoteInfoField;
