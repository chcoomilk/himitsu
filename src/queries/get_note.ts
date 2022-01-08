import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { ErrorKind } from "../utils/types";

interface GetNoteField {
  id: number,
  password: string
}

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
  "id": number,
  "title": string,
}

export const get_note = async ({ id, password }: GetNoteField): Promise<Result<ResponseData>> => {
  const url = BASE_URL + "/notes/" + id;
  let error: ErrorKind = DefaultValue.Error;
  let data: ResponseData = {
    id: 0,
    title: "",
    content: "",
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
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
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
      case 401:
        error = {
          ...error,
          wrongPassword: true,
        }
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
