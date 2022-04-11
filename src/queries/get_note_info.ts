import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { BasicInfo } from "../utils/types";

interface Params {
    id: number
}

type ResponseData = BasicInfo;

// i swear to god, there was no documentation about throwing error here will be caught in useQuery
// albeit Promise<Result<T>> does look pretty cool...
export const get_note_info = async <T>({ id }: Params): Promise<Result<T>> => {
    let url = BASE_URL + "/notes/" + id;
    // let data: ResponseData = {
    //     id: 0,
    //     frontend_encryption: false,
    //     backend_encryption: false,
    //     title: "",
    //     expired_at: null
    // };
    let response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    });

    let data: T = await response.json();
    if (response.ok) {
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
                data,
            }
        } else {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.Popups,
                    serverError: true
                },
                data,
            }
        }
    }
}
