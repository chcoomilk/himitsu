import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { EncryptionMethod, NoteInfo, NoteInfo as ResponseData } from "../utils/types";
import CryptoJS from "crypto-js";

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

export default async function post_note({
    title,
    passphrase,
    encryption,
    content,
    lifetime_in_secs
}: Note): Promise<Result<NoteInfo>> {
    let url = BASE_URL + "/notes";
    let request: Request;
    let data: ResponseData = {
        id: 0,
        title: "",
        backend_encryption: false,
        expired_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        created_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        frontend_encryption: false,
    };

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

    try {
        const result = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (result.ok) {
            data = await result.json();

            return {
                data,
            };
        } else {
            if (result.status >= 400 && result.status < 500) {
                return {
                    data,
                    error: "clientError",
                };
            } else {
                return {
                    data,
                    error: "serverError",
                };
            }
        }
    } catch (error) {
        return {
            data,
            error: "serverError",
        };
    }
}
