import { HIGHLIGHT_URL } from "../utils/constants";

const highlighter = async (data: string): Promise<string> => {
    const res = await fetch(HIGHLIGHT_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        throw res.status;
    }

    return (await res.json()).data;
};

export default highlighter;
