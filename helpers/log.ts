import { log } from "../deps.ts";
import config from "../config.ts";

const { LOGLEVEL, LOGHANDLER } = config;
const level: log.LevelName = LOGLEVEL
  ? <log.LevelName> LOGLEVEL?.toUpperCase()
  : "INFO";
const handler = LOGHANDLER?.split(",") ?? ["console"];

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler(level),
  },
  loggers: {
    default: {
      level: level,
      handlers: handler,
    },
  },
});

export default log.getLogger();
