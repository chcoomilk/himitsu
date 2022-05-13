import { Table, TableProps } from "react-bootstrap";
import { into_readable_datetime } from "../../utils/functions";
import { NoteInfo } from "../../utils/types";

type Props = TableProps & {
  notes: NoteInfo[],
}

type NoteInfoKey = keyof NoteInfo;
// make keyof T as array with constraint all keys must exist
// const noteInfoKeys = <T extends NoteInfoKey[]>(
//   array: T & ([NoteInfoKey] extends [T[number]] ? unknown : 'Invalid')
// ) => array;

const NotesTable = ({ notes, ...attributes }: Props) => {
  return (
    <Table striped bordered hover variant="dark" {...attributes} >
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
              if (header === "expired_at") custom = "Time Left";
              return (<th>{custom || header}</th>);
            })
          }
        </tr>
      </thead>
      <tbody>
        {/* <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr> */}
        {
          notes.map(note => {
            return (
              <tr>
                <td>{note.id}</td>
                <td>{note.title}</td>
                <td>{note.created_at.secs_since_epoch}</td>
                <td>{note.expired_at ? into_readable_datetime(note.expired_at.secs_since_epoch) : "Never"}</td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
};

export default NotesTable;
