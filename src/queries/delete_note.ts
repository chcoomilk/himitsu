import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { local_storage } from "../utils/functions";
import { ErrorKind } from "../utils/types";

interface Params {
    id: string,
    passphrase: string | null
}

interface ResponseData {
    id: string,
}

export default async function delete_note({ id, passphrase }: Params): Promise<Result<ResponseData>> {
    let url = BASE_URL + "/notes/" + encodeURIComponent(id);
    let error: keyof ErrorKind;
    let data: ResponseData = { id: "" };

    let token = local_storage.get("token");
    if (token === null) {
        return {
            data,
            error: "accessDenied",
        };
    } else {
        url += "?token=" + encodeURIComponent(token);
    }

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
            data,
        };
    } else {
        switch (response.status) {
            case 404:
                error = "notFound";
                break;
            case 403:
                error = "accessDenied";
                break;
            case 401:
                error = "accessDenied";
                break;
            default:
                error = "serverError";
                break;
        }

        return {
            error,
            data
        };
    }
}
