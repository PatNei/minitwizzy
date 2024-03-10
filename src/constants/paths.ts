export const DB_PATH =
	process.env.DB_TESTING === "true"
		? ":memory:"
		: process.env.DB_ENV ?? "/tmp/twizzy.db";
export const MIGRATIONS_PATH = `${process.cwd()}/src/database/migrations`;
export const SCHEMA_PATH = `${process.cwd()}/src/constants/schema.ts`;
export const REDIS_CONNECTION_STRING =
	process.env.REDIS_CONNECTION_STRING ?? "redis://127.0.0.1:6379";
