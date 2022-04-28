// https://javascript.info/task/truncate

export default function truncate_string(str: string, maxlength = 8) {
    return (str.length > maxlength) ?
        str.slice(0, maxlength - 1) + '…' : str;
}
