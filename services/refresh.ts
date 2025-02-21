import { Context, Status } from "../deps.ts";
import log from "../helpers/log.ts";
import config from "../config.ts";
import { User } from "../models/User.ts";
import { AppContext, RequestContext } from "../helpers/context.ts";

export const refresh = async (ctx: Context<RequestContext, AppContext>) => {
  const refreshToken = await ctx.cookies.get("refreshToken");

  //Check if the request includes a refresh token
  if (!refreshToken) {
    log.warning("No refresh token in request");
    ctx.throw(Status.BadRequest, "No refresh token in request");
  }

  //Validate the refresh token recieved
  const validatedToken = await ctx.app.state.jwt.validateJWT(refreshToken);

  if (validatedToken) {
    const result = ctx.app.state.db.queryEntries<User>(
      `SELECT uuid, name, email, active, created_at, updated_at FROM users WHERE jwt_id = $1;`,
      [validatedToken.jti],
    );

    //Check if the user exists in the database
    if (!result.length) {
      log.warning("User refresh token was not found in database");
      ctx.throw(Status.BadRequest, "Invalid Refresh Token");
    }

    const user = result[0];

    //Check if the user has an 'active' account
    if (!user.active) {
      log.warning("User record is not active");
      ctx.throw(Status.Forbidden, "User has been disabled");
    }

    const userAccesstoken = await ctx.state.jwt.makeAccesstoken(user);
    const userRefreshtoken = await ctx.state.jwt.makeRefreshtoken(
      ctx.app.state.db,
      user,
    );

    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    ctx.response.status = Status.OK;
    ctx.response.headers.set(
      "x-authc-client-origin",
      `${config.CLIENTORIGIN}`,
    );

    ctx.cookies.set("refreshToken", userRefreshtoken, {
      httpOnly: true,
      expires: date,
      secure: config.SECURE?.toLowerCase() !== "false",
      sameSite: "none",
    });

    const userAttributes = {
      name: user.name,
      email: user.email,
      created: user.created_at,
      // deno-lint-ignore camelcase
      access_token: userAccesstoken.token,
      // deno-lint-ignore camelcase
      access_token_expiry: userAccesstoken.expiration,
    };

    ctx.response.body = {
      data: {
        id: user.uuid,
        type: "Refresh",
        attributes: userAttributes,
      },
    };
  } else {
    log.warning("User did not provide a valid token");
    ctx.throw(Status.BadRequest, "Invalid Refresh Token");
  }
};
