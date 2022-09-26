export { default as delete_note } from "./delete_note";
export { default as get_note } from "./get_note";
export { default as get_note_info } from "./get_note_info";
export { default as post_note } from "./post_note";
export { default as validate_token } from "./post_token_validation";
export { default as combine_token } from "./put_two_token";

import { ErrorKind } from "../utils/types";

export interface Result<T> {
    data: T,
    error?: keyof ErrorKind,
}
