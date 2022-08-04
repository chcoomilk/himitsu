import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { local_storage } from "../utils/functions";
import jwtDecode from "jwt-decode";
import { JWTToken } from "../utils/types";
import toast from "react-hot-toast";
import unwrap_default from "../utils/functions/unwrap";

export default async function validate_token(
    _token?: string
): Promise<Result<boolean>> {
    let token: string;
    if (_token) {
        token = _token;
    } else {
        let ls_token = local_storage.get("token");

        if (!ls_token) {
            toast("Empty token, make a note to generate one");
            return {
                data: false,
            };
        } else {
            token = ls_token;
        }
    }

    try {
        jwtDecode<JWTToken>(token);
    } catch (error) {
        return {
            data: false,
        };
    }


    let url = BASE_URL + "/token";
    try {
        const result = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        });
        if (result.status === 200) {
            return {
                data: true,
            };
        } else {
            return {
                data: false,
            };
        }
    } catch (error) {
        unwrap_default("serverError");
        return {
            data: false,
        };
    }
}
