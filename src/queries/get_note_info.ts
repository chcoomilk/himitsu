import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";

interface Param {
    id: number
}

interface ResponseData {
    "encryption": boolean,
    "decryptable": boolean,
    "expired_at": {
        "nanos_since_epoch": number,
        "secs_since_epoch": number
    } | null,
    "id": number,
    "title": string
}

export const get_note_info = async ({ id }: Param): Promise<Result<ResponseData>> => {
    let url = BASE_URL + "/notes/" + id;
    let data: ResponseData = {
        id: 0,
        encryption: false,
        decryptable: false,
        title: "",
        expired_at: null
    };

    let response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (response.ok) {
        data = await response.json();
        return {
            is_ok: true,
            error: DefaultValue.Error,
            data,
        }
    } else {
        if (response.status === 404) {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.Error,
                    notFound: true
                },
                data
            }
        } else {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.Error,
                    serverError: true
                },
                data
            }
        }
    }
}
