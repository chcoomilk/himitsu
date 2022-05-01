import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";
import { useTitle } from "../../custom-hooks";
import FindByID from "./FindNote/ByID";
import FindByTitle from "./FindNote/ByTitle";
import { parseStringToSearchOptionEnum, SearchOptions } from "./FindNote/utils";

const FindNote = () => {
  useTitle("Find");
  const [urlQuery, setUrlQuery] = useSearchParams();
  const [findBy, setFindBy] = useState<SearchOptions | null>(null);

  useEffect(() => {
    let qby = urlQuery.get("by");
    
    if (qby) {
      setFindBy(parseStringToSearchOptionEnum(qby));
    }
  }, [urlQuery, setFindBy]);

  useEffect(() => {
    if (findBy !== null) {
      let name = Object.keys(SearchOptions)[Object.values(SearchOptions).indexOf(findBy)];
      setUrlQuery({ by: name.toLowerCase() });
    }
  }, [findBy, setUrlQuery]);

  const matchFilter = useCallback(() => {
    let idp = <FindByID setToggleSearch={setFindBy} />;
    switch (findBy) {
      case SearchOptions.ID:
        return idp;
      case SearchOptions.Title:
        return (
          <FindByTitle setToggleSearch={setFindBy} />
        );
      default:
        return idp;
    }
  }, [findBy]);

  return (
    <Row>
      <Col md={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
        {matchFilter()}
      </Col>
    </Row>
  );
};

export default FindNote;
