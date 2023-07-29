import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { useLocalStorage } from "usehooks-ts";
import { is_note_info } from "../../utils/is";
import { NoteInfo } from "../../utils/types";

type LastSavedNote = NoteInfo | null;

const useLastSavedNote = (): [LastSavedNote, Dispatch<SetStateAction<LastSavedNote>>] => {
  const [lastSavedNote, setLastSavedNote] = useState<LastSavedNote>(null);
  const [lsLastSavedNote, setLsLastSavedNote] = useLocalStorage<LastSavedNote>("last_saved_note", null);

  useEffect(() => {
    if (is_note_info(lsLastSavedNote)) {
      setLastSavedNote(lsLastSavedNote);
    }
  }, [lsLastSavedNote]);

  return [lastSavedNote, setLsLastSavedNote];
};

export default useLastSavedNote;
