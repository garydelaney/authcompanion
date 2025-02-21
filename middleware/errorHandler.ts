import { Context, Status } from "../deps.ts";
import log from "../helpers/log.ts";

export const errorHandler = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (err) {
    log.error(err);
    ctx.response.status = err.status || Status.InternalServerError;
    ctx.response.type = "json";
    ctx.response.body = {
      errors: [
        {
          title: "Server Error",
          detail: err.message,
        },
      ],
    };
  }
};
