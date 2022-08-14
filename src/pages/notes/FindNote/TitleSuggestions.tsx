import { ListGroup, ListGroupProps, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import useDebounce from "../../../custom-hooks/useDebounce";
import { NoteInfo } from "../../../utils/types";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../utils/constants";
import { into_readable_datetime, truncate_string } from "../../../utils/functions";
import { get_notes } from "../../../queries/get_notes";

interface Props extends ListGroupProps {
  query: string,
}

const TitleSuggestions: React.FC<Props> = ({ query, ...attributes }) => {
  const navigate = useNavigate();
  const { debouncedValue } = useDebounce(query, 400);
  const { data, isFetching } = useQuery<NoteInfo[]>(["notes", 4, debouncedValue], get_notes);

  return (
    <ListGroup {...attributes}>
      {
        !isFetching
          ? (
            data &&
              data.length
              ? data.map((note_info) => {
                return (
                  <ListGroup.Item
                    action
                    className="d-flex justify-content-between align-items-start"
                    variant="dark"
                    href={PATHS.note_detail + "/" + note_info.id}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(PATHS.note_detail + "/" + note_info.id);
                    }}
                    key={note_info.id}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">
                        {note_info.title ? truncate_string(note_info.title, 30) : (
                          <span className="text-muted">No title</span>
                        )}
                      </div>
                      ID {note_info.id},
                      <br />
                      {into_readable_datetime(note_info.created_at.secs_since_epoch)}
                    </div>
                    {
                      note_info.expires_at
                        ? (
                          <>
                            <i className="bi bi-hourglass-split"></i>
                            <Countdown
                              date={note_info.expires_at.secs_since_epoch * 1000}
                            />
                          </>
                        )
                        : null
                    }
                  </ListGroup.Item>
                );
              }) : (
                <ListGroup.Item variant="dark" className="text-center">Nothing found...</ListGroup.Item>
              )
          ) : (
            <ListGroup.Item variant="dark" className="text-center">
              <Spinner animation="grow" variant="dark" />
            </ListGroup.Item>
          )
      }
    </ListGroup>
  );
};

export default TitleSuggestions;
