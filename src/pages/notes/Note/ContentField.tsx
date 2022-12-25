import { Placeholder, Row } from "react-bootstrap";
import { generate_face } from "../../../utils/functions";
import HighlightJSAuto from "./HighlightJSAuto";

type Props = {
  content?: string,
  isLoading: boolean,
  encrypted: boolean,
}

const BGCOLOR = "#2b2b2b";

const ContentTextarea = ({ content, encrypted, isLoading }: Props): JSX.Element => {
  if (content && !encrypted && !isLoading) {
    return (
      <HighlightJSAuto content={content} />
    );
  }

  return (
    <Row style={{ backgroundColor: BGCOLOR, padding: "1em" }}>
      {
        isLoading
          ? (
            <Placeholder animation="wave">
              <Placeholder xs="1" /> <Placeholder xs="1" /> <Placeholder xs="1" />
              <div className="col-12" style={{ height: "14px" }} />
              <Placeholder xs="2" /> <Placeholder xs="3" />
              <Placeholder xs="11" />
              <Placeholder xs="8" /> <Placeholder xs="2" />
              <Placeholder xs="2" /> <Placeholder xs="8" />
            </Placeholder>
          )
          : <code className="text-center">{generate_face()}</code>
      }

    </Row>
  );
};

export default ContentTextarea;
