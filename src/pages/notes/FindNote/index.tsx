import { lazy, useEffect, useState } from "react";
import { Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";
import { useTitle, useDescribe } from "../../../custom-hooks";
import FindByID from "./ByID";
// import FindByTitle from "./ByTitle";
import { is_opts, UrlParams } from "./utils";
const FindByTitle = lazy(() => import("./ByTitle"));

const FindNote = () => {
  useTitle("Find");
  useDescribe(
    `Find any notes by its ID or find it through 
    title search on public notes posted by other users or yourself`
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<UrlParams>({
    query: searchParams.get("q") || undefined,
    findBy: (() => {
      let x = searchParams.get("by");
      x = x?.toLowerCase().trim() || null;

      return is_opts(x) ? x : undefined;
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
    <Container className="d-flex flex-fill align-items-center justify-content-center">
      {
        params.findBy === "title" ? (
          <FindByTitle params={params} setParams={setParams} />
        ) : (
          <FindByID params={params} setParams={setParams} />
        )
      }
    </Container>
  );
};

export default FindNote;
