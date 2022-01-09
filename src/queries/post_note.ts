import { Result } from ".";
import { BASE_URL, DefaultValue, TIME_CONFIG } from "../utils/constants";
import { EncryptionMethod, ErrorKind } from "../utils/types";
import CryptoJS from "crypto-js";

interface NoteInfo {
    id: number,
    expiryTime: string,
}

interface Note {
    title: string,
    encryption: EncryptionMethod,
    content: string,
    password: string,
    lifetime_in_secs: number,
}

interface Request {
    title: string,
    encryption: boolean,
    content: string,
    password?: string,
    lifetime_in_secs?: number | null,
}

export async function post_note({ title, password, encryption, content, lifetime_in_secs }: Note): Promise<Result<NoteInfo>> {
    let error: ErrorKind = DefaultValue.Error;
    let url = BASE_URL + "/notes/new/";
    let request: Request;

    switch (encryption) {
        case EncryptionMethod.NoEncryption:
            request = {
                title,
                content,
                encryption: false,
                lifetime_in_secs: lifetime_in_secs || null
            };
            break;
        case EncryptionMethod.BackendEncryption:
            request = {
                title,
                content,
                password,
                encryption: true,
                lifetime_in_secs: lifetime_in_secs || null
            };
            break;
        case EncryptionMethod.FrontendEncryption:
            let encrypted_content = CryptoJS.AES.encrypt(content, password).toString();
            request = {
                title,
                content: encrypted_content,
                encryption: true,
                lifetime_in_secs: lifetime_in_secs || null
            };
            break;
    }

    const result = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (result.ok) {
        interface Response {
            expired_at: {
                "nanos_since_epoch": number,
                "secs_since_epoch": number
            } | null,
            id: number
        }

        const data: Response = await result.json();
        const date_from_epoch = data.expired_at !== null 
            ? new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, TIME_CONFIG)
            : "Never"
        const readableDateTime = date_from_epoch;
        return {
            is_ok: true,
            data: {
                expiryTime: readableDateTime,
                id: data.id,
            },
            error,
        };
    } else {
        return {
            is_ok: false,
            data: {
                expiryTime: "",
                id: 0
            },
            error: {
                ...error,
                serverError: true,
            }
        }
    }
};
