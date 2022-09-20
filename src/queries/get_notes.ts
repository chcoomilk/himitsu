import { QueryFunctionContext, QueryKey } from "react-query";
import { BASE_URL } from "../utils/constants";
import { NoteInfo } from "../utils/types";

export async function get_notes({ queryKey, pageParam }: QueryFunctionContext<QueryKey, number>): Promise<NoteInfo[]> {
    // there should be a better way to typesafe this
    let limit = queryKey[1] as number;
    let query = queryKey[2] as string;
    query = query.replaceAll("%", "\\%").replaceAll("_", "\\_");

    try {
        const res = await fetch(BASE_URL + `/notes?offset=${pageParam || 0}&limit=${limit}&title=%${encodeURIComponent(query)}%`);
        if (res.status !== 200) {
            throw res.status;
        }

        return res.json();
    } catch (error) {
        throw error;
    }
}
