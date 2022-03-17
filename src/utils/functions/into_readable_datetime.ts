import { TIME_CONFIG } from "../constants";

export default function into_readable_datetime(unix_epoch: number): string {
    return new Date(unix_epoch * 1000)
        .toLocaleString(undefined, TIME_CONFIG);
}
