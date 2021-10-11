export interface ErrorKind {
  notFound: boolean,
  wrongPassword: boolean,
  serverError: boolean,
  fieldError: string[],
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
