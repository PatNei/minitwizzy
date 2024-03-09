import { Hono } from 'hono'
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';


class MyLogWriter implements LogWriter {
  write(message: string) {
    // Write to file, stdout, etc.
  }
}
const logger = new DefaultLogger({ writer: new MyLogWriter() });


const sqlite = new Database('/tmp/sqlite.db');

const db = drizzle(sqlite, {logger});

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
