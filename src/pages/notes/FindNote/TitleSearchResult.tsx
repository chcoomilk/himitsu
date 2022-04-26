import { ListGroup, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import useDebounce from "../../../custom-hooks/useDebounce";
import { NoteInfo } from "../../../utils/types";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../utils/constants";
import { generate_face } from "../../../utils/functions";

type Props = {
  query: string
}

const SearchResult = ({ query }: Props) => {
  const navigate = useNavigate(); 
  const { debouncedValue } = useDebounce(query, 400);
  const { data, isFetching } = useQuery<NoteInfo[]>([`/notes?title=${debouncedValue}%&limit=${5}`]);
  
  return (
    <ListGroup className="mt-3" hidden={data === undefined}>
      {
        !isFetching
          ? (
            data &&
              data.length
              ? data.map((note_info, i) => {
                return (
                  <ListGroup.Item
                    action
                    className="d-flex justify-content-between align-items-start"
                    variant="warning"
                    href={PATHS.note_detail + "/" + note_info.id}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(PATHS.note_detail + "/" + note_info.id);
                    }}
                    key={i}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{note_info.title}</div>
                      ID: {note_info.id},
                      encryption: {String(note_info.frontend_encryption) || String(note_info.backend_encryption)}
                    </div>
                    {
                      note_info.expired_at
                        ? <Countdown
                          date={note_info.expired_at.secs_since_epoch * 1000}
                        />
                        : "Never"
                    }
                  </ListGroup.Item>
                );
              }) : (
                <ListGroup.Item variant="warning" className="text-center">Nothing found {generate_face()}</ListGroup.Item>
              )
          ) : (
            <ListGroup.Item variant="warning" className="text-center">
              <Spinner animation="grow" variant="dark" />
            </ListGroup.Item>
          )

      }
    </ListGroup>
  );
};

export default SearchResult;
