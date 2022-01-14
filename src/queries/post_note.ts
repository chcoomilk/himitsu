import { Result } from ".";
import { BASE_URL, DefaultValue, TIME_CONFIG } from "../utils/constants";
import { EncryptionMethod, Popup, BasicInfo } from "../utils/types";
import CryptoJS from "crypto-js";

interface NoteInfo {
    id: number,
    expiryTime: string,
}

interface Note {
    title: string,
    encryption: EncryptionMethod,
    content: string,
    passphrase: string,
    lifetime_in_secs: number,
}

interface Request {
    title: string,
    is_currently_encrypted: boolean,
    content: string,
    passphrase: string | null,
    lifetime_in_secs: number | null,
}

type ResponseData = BasicInfo;

export async function post_note({ title, passphrase, encryption, content, lifetime_in_secs }: Note): Promise<Result<NoteInfo>> {
    let error: Popup = DefaultValue.Popups;
    let url = BASE_URL + "/notes/new/";
    let request: Request;

    switch (encryption) {
        case EncryptionMethod.NoEncryption:
            request = {
                title,
                content,
                passphrase: null,
                is_currently_encrypted: false,
                lifetime_in_secs: lifetime_in_secs || null
            };
            break;
        case EncryptionMethod.BackendEncryption:
            request = {
                title,
                content,
                passphrase: passphrase,
                is_currently_encrypted: false,
                lifetime_in_secs: lifetime_in_secs || null
            };
            break;
        case EncryptionMethod.FrontendEncryption:
            let encrypted_content = CryptoJS.AES.encrypt(content, passphrase).toString();
            request = {
                title,
                content: encrypted_content,
                passphrase: null,
                is_currently_encrypted: true,
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
        const data: ResponseData = await result.json();
        const readableDateTime = data.expired_at !== null
            ? new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, TIME_CONFIG)
            : "Never"
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
}
