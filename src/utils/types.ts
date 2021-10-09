export interface ErrorKind {
  notFound: boolean,
  wrongPassword: boolean,
  serverError: boolean
}

export interface BasicNote {
  id: string | number;
  title: string;
  content: string;
  expiryTime: string;
  creationTime: string;
}
