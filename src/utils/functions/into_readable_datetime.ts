import { TIME_CONFIG } from "../constants";

export default function into_readable_datetime(some_numbers_of_time_since_epoch: number): string {
    return new Date(some_numbers_of_time_since_epoch * 1000)
        .toLocaleString(undefined, TIME_CONFIG);
}
