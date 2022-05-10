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
      if (q !== null) {
        setSearchParams({ by, q }, { replace: true });
      } else {
        setSearchParams({ by }, { replace: true });
      }
    } else if (q) {
      setSearchParams({ q }, { replace: true });
    }

    //
    // setSearchParams({ q: params.query || "", by: params.findBy || "" });
  }, [params, setSearchParams]);

  // useEffect(() => {
  //   if (params.findBy) {
  //     let find_by = changeCase.capitalCase(params.findBy);

  //     if (is_opts(find_by)) {
  //       setFindBy(SearchOptions[find_by]);
  //     }
  //   }
  // }, [params.findBy, setFindBy]);

  // useEffect(() => {
  //   let find_by = Object.keys(SearchOptions)[Object.values(SearchOptions).indexOf(findBy)];
  //   setSearchParams({ by: find_by.toLowerCase() }, { replace: true });
  // }, [findBy, setSearchParams]);

  // const matchFilter = useCallback(() => {
  //   let idp = <FindByID setToggleSearch={setFindBy} />;
  //   switch (findBy) {
  //     case SearchOptions.Id:
  //       return idp;
  //     case SearchOptions.Title:
  //       return (
  //         <FindByTitle setToggleSearch={setFindBy} />
  //       );
  //     default:
  //       return idp;
  //   }
  // }, [findBy]);

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
