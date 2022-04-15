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
    // returns early because page first has to initialize with id that hasn't been checked
    if (id === null) return {
        error: DefaultValue.NoError,
        is_ok: false,
        data: DefaultValue.NoteInfo,
    };
    
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
        let data = await response.json();
        return {
            is_ok: true,
            error: DefaultValue.NoError,
            data,
        }
    } else {
        if (response.status === 404) {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.NoError,
                    notFound: true
                },
                data,
            }
        } else {
            return {
                is_ok: false,
                error: {
                    ...DefaultValue.NoError,
                    serverError: true
                },
                data,
            }
        }
    }
};

export default get_note_info;
