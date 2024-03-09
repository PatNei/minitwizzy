import { hc } from "hono/client";
import { RPCType } from "src";

const client = hc<RPCType>("0.0.0.0:3000/");

export const getAllMessages = async (no = 32, offset = 0) => {
	return await client.api.msgs.$get({
		json: {
			no: no,
			offset: offset,
		},
	});
};

export const getUserMessages = async (
	username: string,
	no = 32,
	offset = 0,
) => {
	client.api.msgs[":username"].$get({
		param: { username: username },
		json: { no, offset },
	});
};

export const postUserMessage = async (username: string, content: string) => {
	client.api.msgs[":username"].$post({
		param: { username: username },
		json: { content: content },
	});
};


