// const TIME_CONFIG: Intl.DateTimeFormatOptions | undefined;

export default function into_readable_datetime(unix_epoch_in_secs: number): string {
    const result = new Date(unix_epoch_in_secs * 1000);


    if (isNaN(result.valueOf())) {
        return "Never";
    }

    return result
        .toLocaleString(undefined, {
            weekday: "short",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h24"
        });
}
