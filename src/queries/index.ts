import { Popup } from "../utils/types";
import delete_note from "./delete_note";
// queries should have errorkind instead
export {
    delete_note
};

export interface Result<T> {
    is_ok: boolean,
    data: T,
    // change this to errorkind
    error: Popup,
}
