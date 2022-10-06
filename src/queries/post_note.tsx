import AES from "crypto-js/aes";
import toast from "react-hot-toast";
import { Alert } from "react-bootstrap";
import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { EncryptionMethod, NoteInfo } from "../utils/types";
import { local_storage, unwrap } from "../utils/functions";

interface NewNote {
    double_encrypt: string,
    discoverable: boolean,
    custom_id: string,
    title: string,
    encryption: EncryptionMethod,
    content: string,
    passphrase: string,
    lifetime_in_secs?: number,
}

interface RequestBody {
    discoverable?: boolean,
    id?: string,
    title?: string,
    is_currently_encrypted?: boolean,
    content: string,
    passphrase?: string,
    lifetime_in_secs?: number,
}

type ResponseData = {
    token: string
} & NoteInfo

export default async function post_note({
    double_encrypt,
    discoverable,
    custom_id,
    title,
    passphrase,
    encryption,
    content,
    lifetime_in_secs
}: NewNote): Promise<Result<NoteInfo>> {
    let url = BASE_URL + "/notes";
    let request: RequestBody;
    let data: ResponseData = {
        token: "",
        id: "",
        title: "",
        backend_encryption: false,
        expires_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        created_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
        frontend_encryption: false,
    };

    if (!content) throw new Error("clientError");

    switch (encryption) {
        case EncryptionMethod.NoEncryption:
            request = {
                discoverable: discoverable || undefined,
                id: custom_id,
                title: title || undefined,
                content,
                lifetime_in_secs: lifetime_in_secs || undefined,
            };
            break;
        case EncryptionMethod.BackendEncryption:
            let fe = false;
            if (double_encrypt) {
                try {
                    content = AES.encrypt(JSON.stringify(content), double_encrypt).toString();
                    fe = true;
                } catch (error) {
                    throw error;
                }
            }
            request = {
                id: custom_id,
                title: title || undefined,
                content,
                passphrase: passphrase || undefined,
                is_currently_encrypted: fe || undefined,
                lifetime_in_secs: lifetime_in_secs || undefined,
            };
            break;
        case EncryptionMethod.FrontendEncryption:
            try {
                request = {
                    id: custom_id || undefined,
                    title: title || undefined,
                    content: AES.encrypt(JSON.stringify(content), passphrase).toString(),
                    is_currently_encrypted: true,
                    lifetime_in_secs: lifetime_in_secs || undefined,
                };
            } catch (error) {
                throw error;
            }
            break;
    }

    try {
        let old_token = local_storage.get("token");
        if (old_token) url += ("?token=" + encodeURIComponent(old_token));

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
            local_storage.set("token", data.token);
            delete (data as Partial<ResponseData>).token;
            return {
                data,
            };
        } else {
            if (result.status >= 400 && result.status < 500) {
                if (result.status === 409) {
                    toast.custom(t => (
                        <Alert show={t.visible} variant="danger" dismissible onClose={() => toast.dismiss(t.id)}>
                            <Alert.Heading>
                                <i className="bi bi-x-lg"></i> {" "}
                                Taken ID
                            </Alert.Heading>
                            <p>
                                Custom ID has been taken, please put in something else!
                            </p>
                        </Alert>
                    ), { duration: 6000, ...unwrap.toast_alert_opts });
                    return {
                        data,
                        error: "handled",
                    };
                } else {
                    return {
                        data,
                        error: "clientError",
                    };
                }
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
