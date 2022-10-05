export type Fields = {
    title: string,
    passphrase: string,
    content: string,
    custom_id: string,
    duration: {
        day: number,
        hour: number,
        minute: number,
        second: number,
    }
    extra: {
        encryption: EncryptionMethod,
        double_encryption: {
            enable: boolean,
            passphrase: string,
        },
        discoverable: boolean,
    }
}
