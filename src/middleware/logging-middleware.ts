import { DefaultLogger, LogWriter } from "drizzle-orm/logger";

/** DB SETUP DRIZZLE */
class customDrizzleWriter implements LogWriter {
  write(message: string) {
    customHonoLogger("Drizzle:",message);
    // Write to file, stdout, etc.
  }
}
export const drizzleLogger = new DefaultLogger({
  writer: new customDrizzleWriter(),
});

/** HONO LOGGING */
export const customHonoLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};



/**  */
