import { Hono } from 'hono'
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
