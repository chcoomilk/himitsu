import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { NoteInfo } from "../utils/types";

interface Params {
    id: number | null
}

type ResponseData = NoteInfo;

// i swear to god, there was no documentation about throwing error here will be caught in useQuery
// albeit Promise<Result<T>> does look pretty cool...
const get_note_info = async ({ id }: Params): Promise<Result<ResponseData>> => {
    let data: ResponseData = {
        id: 0,
        title: "",
        backend_encryption: false,
        expired_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        created_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        frontend_encryption: false,
    };

    // returns early because page first has to initialize with id that hasn't been checked
    if (id === null) return {
        error: DefaultValue.errors,
        is_ok: false,
        data,
    };

    let url = BASE_URL + "/notes/" + id;

    let response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (response.ok) {
        let data = await response.json();
        return {
            is_ok: true,
            error: DefaultValue.errors,
            data,
        }
    } else {
        if (response.status === 404) {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.errors,
                    notFound: true
                },
                data,
            }
        } else {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.errors,
                    serverError: true
                },
                data,
            }
        }
    }
};

export default get_note_info;
