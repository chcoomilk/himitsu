import { useEffect } from "react";
import { Placeholder, Container, Col, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { highlighter } from "../../../queries";
import { generate_face } from "../../../utils/functions";

type Props = {
  content?: string,
  isLoading: boolean,
  encrypted: boolean,
}

const ContentTextarea = ({ content, encrypted, isLoading }: Props): JSX.Element => {
  const { mutate, data, isLoading: isHighlighting, isError } = useMutation(highlighter, {
    onError: (e, v, c) => {
      toast("Content could not be highlighted");
      console.warn("content could not be highlighted");
      console.error(e, v, c);
    }
  });

  useEffect(() => {
    content && mutate(content);
  }, [mutate, content]);

  if (content && !encrypted && !isLoading) {
    return (
      <pre className="hljs">
        {
          !isError && data
            ? <code
              className="hljs user-select-all overflow-hidden"
              dangerouslySetInnerHTML={{ __html: data }}
            />
            : (
              <code
                className="hljs user-select-all position-relative"
                style={{ minHeight: isHighlighting ? "64px" : undefined }}
              >
                <Spinner
                  variant="primary"
                  animation="grow"
                  className="position-absolute end-0 translate-middle-x"
                  hidden={!isHighlighting}
                />
                {content}
              </code>
            )
        }

      </pre>
    );
  }

  return (
    <pre className="hljs">
      {
        (isLoading)
          ? (
            <Container fluid className="hljs" style={{ padding: "1em" }}>
              <Placeholder animation="wave">
                <Placeholder xs="1" /> <Placeholder xs="1" /> <Placeholder xs="1" />
                <Col style={{ height: "14px" }} />
                <Placeholder xs="2" /> <Placeholder xs="3" />
                <Col />
                <Placeholder xs="11" />
                <Col />
                <Placeholder xs="8" /> <Placeholder xs="2" />
                <Col />
                <Placeholder xs="2" /> <Placeholder xs="8" />
                <Col />
                <Placeholder xs="5" /> <Placeholder xs="4" />
                <Col />
                <Placeholder xs="3" /> <Placeholder xs="2" />
                <Col />
                <Placeholder xs="4" /> <Placeholder xs="6" />
                <Col style={{ height: "14px" }} />
                <Placeholder xs="11" />
                <Col />
                <Placeholder xs="8" /> <Placeholder xs="2" />
                <Col />
                <Placeholder xs="2" /> <Placeholder xs="8" />
                <Col />
                <Placeholder xs="5" /> <Placeholder xs="4" />
                <Col />
                <Placeholder xs="3" /> <Placeholder xs="2" />
              </Placeholder>
            </Container>
          )
          : <code className="hljs text-center">
            {
              encrypted
                ? "Note needs to be decrypted first"
                : "Error!! Connection timed out or note does not exist in the database " + generate_face()
            }

          </code>
      }
    </pre>
  );
};

export default ContentTextarea;
