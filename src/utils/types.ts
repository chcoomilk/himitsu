export interface ErrorKind {
  notFound: boolean,
  wrongPassphrase: boolean,
  serverError: boolean,
  invalidId: boolean,
  passphraseNotRequired: boolean,
  tooManyRequests: boolean,
}

export interface UserActionInfo {
  noteDeletion: number | null,
}

// alert can be either error or just notification from response
export type Alert = ErrorKind & UserActionInfo;

export interface NoteType {
  id: number,
  title: string,
  content: string,
  already_decrypted: boolean,
  encryption: EncryptionMethod,
  expiryTime: string,
  creationTime: string,
  lastUpdateTime: string,
  passphrase: string | null,
}

export interface NoteInfo {
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

export enum AppTheme {
  Normal = "normal",
  Black = "black",
  Light = "light",
}
