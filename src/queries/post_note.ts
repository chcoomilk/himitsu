import { Result } from ".";
import { BaseUrl, timeConfig } from "../utils/constants";
import { EncryptionMethod, ErrorKind } from "../utils/types";
import CryptoJS from "crypto-js";

interface Data {
    expiryTime: string,
    id: string,
}

type Note = {
    encryption: EncryptionMethod,
    title: string,
    content: string,
    password?: string,
    lifetime_in_secs: string,
}

export async function post_note({ encryption, title, content, password, lifetime_in_secs }: Note): Promise<Result<Data>> {
    let error: ErrorKind = {
        notFound: false,
        wrongPassword: false,
        serverError: false,
    };
    let data: Data = {
        expiryTime: "",
        id: "",
    };
    let url = BaseUrl + "/notes" + (encryption === EncryptionMethod.ServerEncryption ? "/new" : "/plain");
    let converted_val;

    if (encryption === EncryptionMethod.NoEncryption) {
        converted_val = {
            title: title,
            content: content,
            is_encrypted: "false",
            lifetime_in_secs: lifetime_in_secs.toString()
        };
    } else {
        if (typeof password === "undefined") {
            return {
                is_ok: false,
                data,
                error: {
                    ...error,
                    wrongPassword: true
                }
            };
        }

        if (encryption === EncryptionMethod.ServerEncryption) {
            converted_val = {
                title,
                content,
                password,
                lifetime_in_secs,
            };
        } else {
            let encrypted_title = CryptoJS.AES.encrypt(title, password).toString();
            let encrypted_content = CryptoJS.AES.encrypt(content, password).toString();

            converted_val = {
                title: encrypted_title,
                content: encrypted_content,
                is_encrypted: "true",
                lifetime_in_secs: lifetime_in_secs.toString()
            };
        }
    }


    const result = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(converted_val)
    });

    if (result.ok) {
        interface Response {
            expired_at: {
                "nanos_since_epoch": number,
                "secs_since_epoch": number
            },
            id: string
        }

        const data: Response = await result.json();
        const date_from_epoch = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, timeConfig);
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
            data,
            error: {
                ...error,
                serverError: true,
            }
        }
    }
};
