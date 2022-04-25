import { useState } from "react";
import { Col, Row } from "react-bootstrap"
import { useTitle } from "../../custom-hooks";
import FindByID from "./FindNote/ByID";
import FindByTitle from "./FindNote/ByTitle";

const FindNote = () => {
  useTitle("Find");
  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <Row>
      <Col md={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
        {
          toggleSearch
            ? <FindByTitle setToggleSearch={setToggleSearch} />
            : <FindByID setToggleSearch={setToggleSearch} />
        }
      </Col>
    </Row>
  );
};

export default FindNote;
