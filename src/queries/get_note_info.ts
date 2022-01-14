import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { BasicInfo } from "../utils/types";

interface Params {
    id: number
}

type ResponseData = BasicInfo;

export const get_note_info = async ({ id }: Params): Promise<Result<ResponseData>> => {
    let url = BASE_URL + "/notes/" + id;
    let data: ResponseData = {
        id: 0,
        frontend_encryption: false,
        backend_encryption: false,
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
            error: DefaultValue.Popups,
            data,
        }
    } else {
        if (response.status === 404) {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.Popups,
                    notFound: true
                },
                data
            }
        } else {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.Popups,
                    serverError: true
                },
                data
            }
        }
    }
}
