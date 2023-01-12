import { useState } from "react";
import Container from "react-bootstrap/Container";
import { useInfiniteQuery, } from "react-query";
import { useDescribe } from "../../../custom-hooks";
import { local_storage } from "../../../utils/functions";
import { NoteInfo } from "../../../utils/types";
import NoteTable from "./NoteTable";

// type ValidSource = "local" | "global"

// const allSourceKeys = <T extends ValidSource[]>(
//   ...array: T & ([ValidSource] extends [T[number]] ? unknown : 'Missing some key(s)')
// ) => array;

// const is_source = (x: unknown): x is ValidSource => {
//   return typeof x === "string" ? allSourceKeys("local", "global").includes((x as any)) : false;
// };

const Notes = () => {
  useDescribe(`Keeping your notes safe here`);
  const [limit] = useState(5);

  const { data, refetch, } = useInfiniteQuery<NoteInfo[]>(
    ["local_notes", limit],
    () => local_storage.get("notes") || [],
  );

  return (
    <Container className="overflow-auto my-5">
      {data && <NoteTable
        notes={data.pages[0]}
        onDelete={notes => {
          const ok = window.confirm("Delete notes?");
          if (ok) {
            const ns = local_storage.get("notes");
            if (ns) {
              notes.rows.forEach((r, i) => {
                ns.splice(r.index - i, 1);
              });
              local_storage.set("notes", ns);
              refetch();
            }
          }
        }}
      />}
    </Container>
  );
};

export default Notes;
