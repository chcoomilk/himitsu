export interface ErrorKind {
  notFound: boolean,
  wrongPassword: boolean,
  serverError: boolean,
  invalidId: boolean,
  passwordNotRequired: boolean,
}

export interface BasicNote {
  id: number,
  title: string,
  content: string,
  expiryTime: string,
  creationTime: string,
  decrypted: boolean,
  fetched: boolean,
}

export enum EncryptionMethod {
  NoEncryption,
  FrontendEncryption,
  BackendEncryption,
}
