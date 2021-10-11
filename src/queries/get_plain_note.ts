import { BaseUrl } from "../utils/constants";
import { ErrorKind } from "../utils/types";

interface ResponseData {
  "content": string,
  "created_at": {
    "nanos_since_epoch": number,
    "secs_since_epoch": number
  },
  "expired_at": {
    "nanos_since_epoch": number,
    "secs_since_epoch": number
  },
  "is_encrypted": boolean,
  "id": string,
  "title": string,
}

interface Result {
  is_ok: boolean,
  data: ResponseData,
  error: ErrorKind,
}

export const get_plain_note = async (id: string): Promise<Result> => {
  const url = BaseUrl + "/notes/plain/" + id;
  let error: ErrorKind = {
    notFound: false,
    wrongPassword: false,
    serverError: false,
    fieldError: [],
  };
  let data: ResponseData = {
    id: "",
    title: "",
    content: "",
    is_encrypted: false,
    created_at: {
      nanos_since_epoch: 0,
      secs_since_epoch: 0,
    },
    expired_at: {
      nanos_since_epoch: 0,
      secs_since_epoch: 0,
    },
  };

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  });

  if (response.ok) {
    data = await response.json();
    return {
      is_ok: true,
      error,
      data,
    };
  } else {
    switch (response.status) {
      case 404:
        error = {
          ...error,
          notFound: true,
        };
        break;
      default:
        error = {
          ...error,
          serverError: true,
        };
        break;
    }
    return {
      is_ok: false,
      error,
      data
    };
  }
};
