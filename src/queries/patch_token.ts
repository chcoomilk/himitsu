import jwtDecode from "jwt-decode";
import { BASE_URL } from "../utils/constants";
import { local_storage } from "../utils/functions";
import unwrap_default from "../utils/functions/unwrap";

type Params = {
    token: string,
}

/**
 * Refresh token and automatically set it to local storage
 * @param token JWT token to be updated by the server
 * @returns Refreshed JWT token without the invalid ids leading to nonexisting notes
 */
const patch_token = async ({ token }: Params): Promise<string | undefined> => {
    let ret;
    fetch(BASE_URL + "/token", {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token,
        })
    }).then(resp => (resp.json().then(res => {
        let is_token: boolean;
        try {
            jwtDecode(res.token);
            is_token = true;
        } catch (error) {
            is_token = false;
        }

        if (is_token) {
            local_storage.set("token", res.token);
            ret = res.token
        } else {
            // client's outdated
            unwrap_default("clientError");
        }
    }).catch(() => (unwrap_default("clientError")))).catch(() => ("retry later"))).finally(() => {
        let d = new Date();
        d.setHours(d.getHours() + 2);
        localStorage.setItem("refresh_token_timestamp", d.toString());
    });

    return ret;
};

export default patch_token;
