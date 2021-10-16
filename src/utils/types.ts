export interface ErrorKind {
  notFound: boolean,
  wrongPassword: boolean,
  serverError: boolean,
}

export interface BasicNote {
  id: string | number;
  title: string;
  content: string;
  expiryTime: string;
  creationTime: string;
}

export interface FieldsWithEncryption {
  title: string,
  content: string,
}

export enum EncryptionMethod {
  NoEncryption,
  EndToEndEncryption,
  ServerEncryption,
}
