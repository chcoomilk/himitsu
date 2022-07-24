import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";
import { useTitle } from "../../custom-hooks";
import FindByID from "./FindNote/ByID";
import FindByTitle from "./FindNote/ByTitle";
import { is_opts, UrlParams } from "./FindNote/utils";

const FindNote = () => {
  useTitle("Find");
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<UrlParams>({
    query: searchParams.get("q"),
    findBy: (() => {
      let x = searchParams.get("by");
      x = x?.toLowerCase().trim() || null;

      return is_opts(x) ? x : null;
    })(),
  });

  useEffect(() => {
    let q = params.query, by = params.findBy;

    if (by) {
      if (typeof q === "string" && q !== "") {
        setSearchParams({ by, q }, { replace: true });
      } else {
        setSearchParams({ by }, { replace: true });
      }
    } else if (q) {
      setSearchParams({ q }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [params, setSearchParams]);

  return (
    <Row>
      <Col md={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
        {
          params.findBy === "title" ? (
            <FindByTitle params={params} setParams={setParams} />
          ) : (
            <FindByID params={params} setParams={setParams} />
          )
        }
      </Col>
    </Row>
  );
};

export default FindNote;
