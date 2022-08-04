import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";
import { Result } from ".";
import { BASE_URL } from "../utils/constants";

type Response = {
    token: string
}

export default async function combine_token(
    first_token: string,
    second_token: string
): Promise<Result<Response>> {
    let data: Response = { token: "" };
    try {
        jwtDecode(first_token);
        jwtDecode(second_token);
    } catch (error) {
        toast.error("Invalid JWT token");
        return {
            data,
            error: "handled",
        };
    }

    try {
        const response = await fetch(BASE_URL + "/token", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_token,
                second_token,
            })
        });

        switch (response.status) {
            case 200:
                let res: Response = await response.json();
                return {
                    data: res,
                };

            case 400:
                return {
                    data,
                    error: "clientError",
                };

            case 403:
                toast.error("Invalid JWT token");
                return {
                    data,
                    error: "handled",
                };
            case 429:
                return {
                    data,
                    error: "tooManyRequests",
                };

            default:
                return {
                    data,
                    error: "serverError",
                };
        }
    } catch {
        return {
            data,
            error: "serverError",
        };
    }
}
