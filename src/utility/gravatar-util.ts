import { CryptoHasher } from "bun";
const h = new CryptoHasher("md5");

export const gravatar_url = (email: string, size = 80) => {
	return `http://www.gravatar.com/avatar/${h
		.update(email.toLowerCase().trim())
		.digest("hex")}?d=identicon&s=${size}`;
};
