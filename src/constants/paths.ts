export const DB_PATH =
	process.env.DB_TESTING === "true"
		? ":memory:"
		: process.env.NODE_ENV === "production"
		  ? process.env.DB_ENV ?? "/tmp/twizzy.db"
		  : "./tmp/twizzy.db";
export const MIGRATIONS_PATH = `${process.cwd()}/src/database/migrations`;
export const SCHEMA_PATH = `${process.cwd()}/src/constants/schema.ts`;
