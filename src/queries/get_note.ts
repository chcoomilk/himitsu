import { Result } from ".";
import { BASE_URL } from "../utils/constants";
import { ErrorKind, RawNote } from "../utils/types";

interface GetNoteField {
	id: string,
	passphrase: string | null
}

type ResponseData = RawNote;

const get_note = async ({ id, passphrase }: GetNoteField): Promise<Result<ResponseData>> => {
	const url = BASE_URL + "/notes/" + id;
	let error: keyof ErrorKind;
	let data: ResponseData = {
		id: "",
		title: "",
		content: "",
		backend_encryption: false,
		frontend_encryption: false,
		created_at: {
			nanos_since_epoch: 0,
			secs_since_epoch: 0,
		},
		updated_at: {
			nanos_since_epoch: 0,
			secs_since_epoch: 0,
		},
		expires_at: {
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
		body: JSON.stringify({ passphrase: passphrase })
	});

	if (response.ok) {
		data = await response.json();
		return {
			data,
		};
	} else {
		switch (response.status) {
			case 404:
				error = "notFound";
				break;
			case 401:
				error = "wrongPassphrase";
				break;
			default:
				error = "serverError";
				break;
		}
		return {
			error,
			data
		};
	}
};

export default get_note;
