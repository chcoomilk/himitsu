import { useCallback, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
// import { Container, Pagination } from "react-bootstrap";
import { QueryFunctionContext, QueryKey, useInfiniteQuery, } from "react-query";
import { useSearchParams } from "react-router-dom";
import NotesTable from "../../components/note/NotesTable";
import useDebounce from "../../custom-hooks/useDebounce";
import { get_notes } from "../../queries/get_notes";
import { local_storage } from "../../utils/functions";
import { NoteInfo } from "../../utils/types";

type ValidSource = "local" | "global"

const allSourceKeys = <T extends ValidSource[]>(
  ...array: T & ([ValidSource] extends [T[number]] ? unknown : 'Missing some key(s)')
) => array;

const is_source = (x: unknown): x is ValidSource => {
  return typeof x === "string" ? allSourceKeys("local", "global").includes((x as any)) : false;
};

const Notes = () => {
  const notesRef = useRef<NoteInfo[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params] = useState({
    query: searchParams.get("q"),
    source: (() => {
      let src = searchParams.get("src");
      if (is_source(src)) {
        return src;
      } else {
        return "local";
      }
    })(),
  });

  useEffect(() => {
    let q = params.query, src = params.source;

    if (src) {
      if (typeof q === "string" && q !== "") {
        setSearchParams({ src, q }, { replace: true });
      } else {
        setSearchParams({ src }, { replace: true });
      }
    } else if (q) {
      setSearchParams({ q }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [params, setSearchParams]);

  const [limit] = useState(5);

  const get_slices = useCallback(({ queryKey, pageParam }: QueryFunctionContext<QueryKey, number>): NoteInfo[] => {
    let res: NoteInfo[] = notesRef.current;
    if (notesRef.current.length) res = notesRef.current;
    else {
      res = local_storage.get("notes") || [];
      notesRef.current = res;
    }
    if (typeof queryKey[2] === "string") {
      res = notesRef.current.filter((n) => n.title?.includes(queryKey[2] as string));
    }

    return res.slice(pageParam, (pageParam || 0) + limit);
  }, [notesRef, limit]);

  const { debouncedValue } = useDebounce(params.query, 800);
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<NoteInfo[]>(
    ["notes", limit, debouncedValue],
    get_notes,
    {
      enabled: params.source === "global" && typeof params.query === "string",
      getNextPageParam: (nextVal, pages) => {
        if (nextVal.length !== limit) return undefined;
        return pages.length * limit;
      },
    }
  );

  const { data: localNotes, isLoading: isLnLoading, fetchNextPage: fetchNextLocalNotes, hasNextPage: hasNextLocalNotes } = useInfiniteQuery<NoteInfo[]>(
    ["local_notes", limit, params.query],
    get_slices,
    {
      enabled: params.source === "local",
      getNextPageParam: (nextVal, pages) => {
        if (nextVal.length !== limit) return undefined;
        return pages.length * limit;
      },
    }
  );

  return (
    <Container className="overflow-auto">
      {
        params.source === "global"
          ? <NotesTable className="align-self-center dark"
            loading={isLoading}
            size="sm"
            responsive
            striped
            bordered
            hover
            notes={data?.pages || []}
            loadMore={hasNextPage}
            loadMoreOnClick={fetchNextPage}
          />
          : <NotesTable className="align-self-center dark"
            loading={isLnLoading}
            responsive
            striped
            bordered
            hover
            notes={localNotes?.pages || []}
            loadMore={hasNextLocalNotes}
            loadMoreOnClick={fetchNextLocalNotes}
          />
      }
    </Container>
  );
};

export default Notes;
