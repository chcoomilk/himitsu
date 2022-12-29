import { Handler } from '@netlify/functions';
import hljs from "highlight.js";

type Data = {
  data: string,
}

const isUnhighlightedCodeData = (u: unknown): u is Data => {
  return (
    typeof u === "object" &&
    u !== null &&
    typeof (u as Data).data === "string"
  );
};

const INFO = "JSON structure has to have a key named \"data\" and it's data type should be string";

export const handler: Handler = async (event, context) => {
  let unparsed_data = event.body;
  let valueOnly = true;
  const param = event.queryStringParameters;
  if (param && typeof param["valueOnly"] === "string" && param["valueOnly"] === "false") {
    valueOnly = false;
  }

  if (!unparsed_data) return { statusCode: 400, body: INFO };
  let json: unknown;
  try {
    json = JSON.parse(unparsed_data);
  } catch (error) {
    console.error(error);
    return { statusCode: 400, body: "Data has to be in JSON format" };
  }

  if (!isUnhighlightedCodeData(json)) {
    return { statusCode: 400, body: INFO };
  }

  try {
    const code = hljs.highlightAuto(json.data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: code.illegal
          ? json.data
          : (valueOnly ? code.value : code),
        dataWasIllegal: code.illegal,
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Error occurred when highlighting the data"
    };
  }
};
