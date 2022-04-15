import { Result } from ".";
import { BASE_URL, DefaultValue } from "../utils/constants";
import { ErrorKind } from "../utils/types";

interface GetNoteField {
	id: number,
	passphrase: string | null
}

interface ResponseData {
	"content": string,
	"created_at": {
		"nanos_since_epoch": number,
		"secs_since_epoch": number
	},
	"updated_at": {
		"nanos_since_epoch": number,
		"secs_since_epoch": number
	},
	"backend_encryption": boolean,
	"frontend_encryption": boolean,
	"expired_at": {
		"nanos_since_epoch": number,
		"secs_since_epoch": number
	} | null,
	"id": number,
	"title": string,
}

const get_note = async ({ id, passphrase }: GetNoteField): Promise<Result<ResponseData>> => {
	const url = BASE_URL + "/notes/" + id;
	let error: ErrorKind = DefaultValue.NoError;
	let data: ResponseData = {
		id: 0,
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
		body: JSON.stringify({ passphrase: passphrase })
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
					wrongPassphrase: true,
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

export default get_note;
