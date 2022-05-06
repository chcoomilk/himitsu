// const TIME_CONFIG: Intl.DateTimeFormatOptions | undefined;

export default function into_readable_datetime(unix_epoch: number): string {
    return new Date(unix_epoch * 1000)
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
