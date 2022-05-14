export interface ErrorKind {
  notFound: string | null,
  wrongPassphrase: string | null,
  tooManyRequests: string | null,
  serverError: string | null,
  clientError: string | null,
}

export interface UserActionInfo {
  noteDelete: string | null,
  noteDownload: string | null,
}

// alert can either be error or notification from response
export type Alert = ErrorKind & UserActionInfo

export type RustDateTime = {
  "nanos_since_epoch": number,
  "secs_since_epoch": number,
}

// caution: fleeting dream
// impl RustDateTime { }

export type RawNote = {
  "content": string,
  "created_at": RustDateTime,
  "updated_at": RustDateTime,
  "backend_encryption": boolean,
  "frontend_encryption": boolean,
  "expired_at": RustDateTime | null,
  "id": number,
  "title": string,
}

export interface Note {
  id: number,
  title: string,
  content: string,
  decrypted: boolean,
  encryption: EncryptionMethod,
  expiryTime: string,
  creationTime: string,
  lastUpdateTime: string,
  passphrase: string | null,
  raw?: RawNote,
}

export interface NoteInfo {
  frontend_encryption: boolean,
  backend_encryption: boolean,
  created_at: RustDateTime,
  expired_at: RustDateTime | null,
  id: number,
  title: string
}

export enum EncryptionMethod {
  NoEncryption,
  FrontendEncryption,
  BackendEncryption,
}

export enum AppThemeSetting {
  // System = "system default",
  Normal,
  Black,
  // Light = "light",
}

export type AppSetting = {
  preferences: {
    app_theme: AppThemeSetting,
    encryption: EncryptionMethod,
  },
  history: boolean,
}
