import { InferResponseType, hc } from "hono/client";
import { RPCType } from "src";
import { AUTHORIZATION_HEADERS, PORT_NUMBER } from "src/constants/const";

const client = hc<RPCType>(`http://127.0.0.1:${PORT_NUMBER}`, {
	headers: AUTHORIZATION_HEADERS,
});
export type msgRPCDTO = InferResponseType<typeof client.api.msgs.$get>;

export const getAllMessages = async (no = 32, offset = 0) => {
	const res = await client.api.msgs.$get({
		query: { no: no.toString(), offset: offset.toString() },
	});
	return res.json();
};

export const getUserMessages = async (
	username: string,
	no = 32,
	offset = 0,
) => {
	const res = await client.api.msgs[":username"].$get({
		param: { username: username },
		query: { no: no.toString(), offset: offset.toString() },
	});
	return res.json();
};

export const postUserMessage = async (username: string, content: string) => {
	const res = await client.api.msgs[":username"].$post({
		param: { username: username },
		json: { content: content },
	});
	return res.status;
};

export const createUser = async (
	username: string,
	email: string,
	pwd: string,
) => {
	const res = await client.api.register.$post({
		json: {
			username: username,
			email: email,
			pwd: pwd,
		},
	});
};
