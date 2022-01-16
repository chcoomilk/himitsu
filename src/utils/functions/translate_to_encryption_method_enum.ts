import { EncryptionMethod } from "../types";

type StandardParams = {
    backend_encryption: boolean,
    frontend_encryption: boolean
}

export default function translate_to_encryption_method_enum<
    T extends StandardParams, 
    // BasicInfo extends StandardParams
>(data: T): EncryptionMethod {
    let encryption: EncryptionMethod;
    if (data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
    else if (data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
    else encryption = EncryptionMethod.NoEncryption;
    return encryption;
}
