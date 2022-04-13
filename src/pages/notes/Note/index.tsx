import { useParams } from "react-router";
import { Navigate } from "react-router-dom";
import { PATHS } from "../../../utils/constants";
import Result from "./Note";

const Note = () => {
  let { _id } = useParams();
  return (
    _id
      ? <Result id={+_id} />
      : <Navigate to={PATHS.not_found} />
  );
};

export default Note;
