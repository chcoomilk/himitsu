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

// alert can either be error or notification from response
export type Alert = ErrorKind & UserActionInfo

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
}

export interface NoteInfo {
  frontend_encryption: boolean,
  backend_encryption: boolean,
  created_at: {
    nanos_since_epoch: number,
    secs_since_epoch: number
  },
  expired_at: {
    nanos_since_epoch: number,
    secs_since_epoch: number
  } | null,
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
  }
}
