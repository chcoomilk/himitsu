import { Table, TableProps } from "react-bootstrap";
import { into_readable_datetime } from "../../utils/functions";
import { NoteInfo } from "../../utils/types";
import * as changeCase from "change-case";

type Props = TableProps & {
  notes: NoteInfo[] | null,
}

type NoteInfoKey = keyof NoteInfo;
// make keyof T as array with constraint all keys must exist
// const noteInfoKeys = <T extends NoteInfoKey[]>(
//   array: T & ([NoteInfoKey] extends [T[number]] ? unknown : 'Invalid')
// ) => array;

const NotesTable = ({ notes, ...attributes }: Props) => {
  return (
    <Table {...attributes} >
      <thead>
        <tr>
          {
            Array<NoteInfoKey>(
              "id",
              "title",
              "created_at",
              "expired_at",
            ).map(header => {
              let custom: string | undefined;
              custom = changeCase.noCase(header);
              return (<th key={header}>{custom || header}</th>);
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          notes && notes.length
            ? notes.map(note => {
              return (
                <tr key={note.id}>
                  <td>{note.id}</td>
                  <td>{note.title}</td>
                  <td>{into_readable_datetime(note.created_at.secs_since_epoch)}</td>
                  <td>{note.expired_at ? into_readable_datetime(note.expired_at.secs_since_epoch) : "Never"}</td>
                </tr>
              );
            })
            : <tr><td colSpan={4} className="text-center">Bushwack, it's empty!</td></tr>
        }
      </tbody>
    </Table>
  );
};

export default NotesTable;
