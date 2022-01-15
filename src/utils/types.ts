export interface ErrorKind {
  notFound: boolean,
  wrongPassphrase: boolean,
  serverError: boolean,
  invalidId: boolean,
  passphraseNotRequired: boolean,
}

export interface UserResponseInfo {
  noteDeletion: number | null,
}

export interface Popup extends ErrorKind, UserResponseInfo {};

export interface Note {
  id: number,
  title: string,
  content: string,
  is_already_decrypted: boolean | null,
  encryption: EncryptionMethod,
  expiryTime: string,
  creationTime: string,
  lastUpdateTime: string,
  passphrase: string | null,
}

export interface BasicInfo {
  "frontend_encryption": boolean,
  "backend_encryption": boolean,
  "expired_at": {
    "nanos_since_epoch": number,
    "secs_since_epoch": number
  } | null,
  "id": number,
  "title": string
}

export enum EncryptionMethod {
  NoEncryption,
  FrontendEncryption,
  BackendEncryption,
}
