import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { Popup } from "../utils/types";

interface Params {
    id: number,
    passphrase: string | null
}

interface ResponseData {
    id: number,
}

export default async function delete_note({ id, passphrase }: Params): Promise<Result<ResponseData>> {
    const url = BASE_URL + "/notes/" + id;
    let error: Popup = DefaultValue.Popups;
    let data: ResponseData = { id: 0 };

    const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ passphrase: passphrase })
    });

    if (response.ok) {
        data = await response.json();
        return {
            is_ok: true,
            error,
            data,
        };
    } else {
        switch (response.status) {
            case 404:
                error = {
                    ...error,
                    notFound: true,
                };
                break;
            case 401:
                error = {
                    ...error,
                    wrongPassphrase: true,
                }
                break;
            default:
                error = {
                    ...error,
                    serverError: true,
                };
                break;
        }
        return {
            is_ok: false,
            error,
            data
        };
    }
}
