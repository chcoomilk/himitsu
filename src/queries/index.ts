import { ErrorKind } from "../utils/types";

export interface Result<T> {
    is_ok: boolean,
    data: T,
    error: ErrorKind,
}
