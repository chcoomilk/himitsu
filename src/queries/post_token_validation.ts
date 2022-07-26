import { Result } from ".";
import { local_storage } from "../utils/functions";

export default async function validate_token(
    token: string = (local_storage.get("token") || "")
): Promise<Result<boolean>> {
    return {
        data: false
    };
}
