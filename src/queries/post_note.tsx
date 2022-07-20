import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { EncryptionMethod, NoteInfo, NoteInfo as ResponseData } from "../utils/types";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import { Alert } from "react-bootstrap";
import { unwrap } from "../utils/functions";

interface NewNote {
    double_encrypt?: string,
    discoverable?: boolean,
    custom_id?: string,
    title?: string,
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

export default async function post_note({
    double_encrypt,
    discoverable,
    custom_id,
    title = "",
    passphrase,
    encryption,
    content,
    lifetime_in_secs
}: NewNote): Promise<Result<NoteInfo>> {
    let url = BASE_URL + "/notes";
    let request: RequestBody;
    let data: ResponseData = {
        id: "",
        title: "",
        backend_encryption: false,
        updated_at: {
            nanos_since_epoch: 0,
            secs_since_epoch: 0,
        },
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

    switch (encryption) {
        case EncryptionMethod.NoEncryption:
            request = {
                discoverable,
                id: custom_id,
                title,
                content,
                lifetime_in_secs,
            };
            break;
        case EncryptionMethod.BackendEncryption:
            let fe = false;
            if (double_encrypt) {
                try {
                    content = CryptoJS.AES.encrypt(content, double_encrypt).toString();
                } catch (error) {
                    throw error;
                }
                fe = true;
            }
            request = {
                id: custom_id,
                title,
                content,
                passphrase,
                is_currently_encrypted: fe,
                lifetime_in_secs,
            };
            break;
        case EncryptionMethod.FrontendEncryption:
            try {
                request = {
                    id: custom_id,
                    title,
                    content: CryptoJS.AES.encrypt(content, passphrase).toString(),
                    passphrase,
                    is_currently_encrypted: true,
                    lifetime_in_secs,
                };
            } catch (error) {
                throw error;
            }
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
                if (result.status === 403) {
                    toast.custom(t => (
                        <Alert show={t.visible} variant="danger" dismissible onClose={() => toast.dismiss(t.id)}>
                            <Alert.Heading>
                                <i className="bi bi-x-lg"></i> {" "}
                                Taken ID
                            </Alert.Heading>
                            <p>
                                Custom ID has been taken, please choose something else!
                            </p>
                        </Alert>
                    ), { duration: 6000, ...unwrap.opts });
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
