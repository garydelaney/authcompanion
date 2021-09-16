import {
  base64,
  create,
  decode,
  getNumericDate,
  Header,
  Payload,
  v4,
  verify,
} from "../deps.ts";

import { db } from "../db/db.ts";
import log from "./log.ts";
import config from "../config.ts";

const { ACCESSTOKENKEYPATH, REFRESHTOKENKEYPATH } = config;

async function importKey(path: any) {
  const readKey = await Deno.readTextFile(path);

  const binaryDer = base64.decode(readKey).buffer;

  let key = await crypto.subtle.importKey(
    "raw",
    binaryDer,
    {
      name: "HMAC",
      hash: { name: "SHA-512" },
    },
    true,
    ["sign", "verify"],
  );

  return key;
}

let ACCESSTOKENKEY = await importKey(ACCESSTOKENKEYPATH);
let REFRESHTOKENKEY = await importKey(REFRESHTOKENKEYPATH);

export async function makeAccesstoken(result: any) {
  var date = new Date();
  date.setHours(date.getHours() + 4);

  const key = ACCESSTOKENKEY;
  if (key != undefined) {
    const user = result.rows[0];

    const jwtheader: Header = { alg: "HS512", typ: "JWT" };
    const jwtpayload: Payload = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      exp: getNumericDate(date),
    };

    const resultingToken = await create(jwtheader, jwtpayload, key);

    const responseObj = {
      token: resultingToken,
      expiration: jwtpayload.exp,
    };

    return responseObj;
  }
  throw new Error("ACCESSTOKENKEY is invalid");
}

export async function makeRefreshtoken(result: any) {
  var date = new Date();
  date.setDate(date.getDate() + 30 * 2);

  if (REFRESHTOKENKEY != undefined) {
    const user = result.rows[0];

    const newjtiClaim = v4.generate();

    await db.queryObject(
      "UPDATE users SET refresh_token = $1 WHERE refresh_token = $2 RETURNING *;",
      newjtiClaim,
      user.refresh_token,
    );

    const jwtheader: Header = { alg: "HS512", typ: "JWT" };
    const jwtpayload: Payload = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      jti: newjtiClaim,
      exp: getNumericDate(date),
    };

    return await create(jwtheader, jwtpayload, REFRESHTOKENKEY);
  }
  throw new Error("REFRESHTOKENKEY is invalid");
}

export async function validateRefreshToken(jwt: any) {
  try {
    if (REFRESHTOKENKEY != undefined) {
      await verify(jwt, REFRESHTOKENKEY);
      let validatedToken = await decode(jwt);
      return validatedToken;
    }
    throw new Error("REFRESHTOKENKEY is invalid");
  } catch (err) {
    log.warning(err);
    throw new Error("Reresh Token is Invalid");
  }
}

export async function validateJWT(jwt: any) {
  try {
    if (ACCESSTOKENKEY != undefined) {
      //verify the jwt (includes signature validation) otherwise throw error
      await verify(jwt, ACCESSTOKENKEY);

      //decode the jwt (without signature verfication) otherwise throw error
      let validatedToken = await decode(jwt);

      return validatedToken;
    }
    throw new Error("ACCESSTOKENKEY is invalid");
  } catch (err) {
    log.warning(err);
    throw new Error("Access Token is Invalid");
  }
}

export async function makeRecoverytoken(result: any) {
  var date = new Date();
  date.setMinutes(date.getMinutes() + 10);

  if (ACCESSTOKENKEY != undefined) {
    const user = result.rows[0];

    const jwtheader: Header = { alg: "HS512", typ: "JWT" };
    const jwtpayload: Payload = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      exp: getNumericDate(date),
    };

    const resultingToken = await create(jwtheader, jwtpayload, ACCESSTOKENKEY);

    return {
      token: resultingToken,
      expiration: jwtpayload.exp,
    };
  }
  throw new Error("ACCESSTOKENKEY is invalid");
}
