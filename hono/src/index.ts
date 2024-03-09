import { Hono } from 'hono'
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';
import { logger } from 'hono/logger'

/** HONO LOGGING */
export const customHonoLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}

/** DB SETUP DRIZZLE */
class customDrizzleWriter implements LogWriter {
  write(message: string) {
    customHonoLogger(message)
    // Write to file, stdout, etc.
  }
}
const drizzleLogger = new DefaultLogger({ writer: new customDrizzleWriter() });
const sqlite = new Database('/tmp/sqlite.db');
const db = drizzle(sqlite, {logger:drizzleLogger});

/** HONO APP */
const app = new Hono()
app.use(logger(customHonoLogger))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
