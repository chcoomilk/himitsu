import { EncryptionMethod } from "../../../utils/types"

export type Fields = {
    encryption: EncryptionMethod,
    content: string,
    title: string,
    passphrase: string,
    custom_id: string,
    duration: {
        day: number,
        hour: number,
        minute: number,
        second: number,
    }
    extra: {
        double_encryption: {
            enable: boolean,
            passphrase: string,
        },
        discoverable: boolean,
        allow_delete_with_passphrase: boolean,
        delete_after_read: number,
        textarea_rows: number;
    }
}
