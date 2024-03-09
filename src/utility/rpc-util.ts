import { hc } from "hono/client";
import { RPCType } from "src";

const client = hc<RPCType>("0.0.0.0:3000/");

export const getAllMessages = async (no = 32) => {
	return await client.api.msgs.$get({
		query: {
			no: no,
		},
	});
};

export const getUserMessages = async (userId: string) => {
    client.api.msgs[":username"].$get({
        param: {userId: userId},
    })
}