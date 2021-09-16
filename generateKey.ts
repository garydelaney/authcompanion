// @ts-nocheck
import { base64 } from "./deps.ts";

let key = await crypto.subtle.generateKey(
  {
    name: "HMAC",
    hash: { name: "SHA-512" },
  },
  true,
  ["sign", "verify"],
);

const exported = await crypto.subtle.exportKey("raw", key);

const exportbase64 = base64.encode(exported);

await Deno.writeTextFile("./keyfile", exportbase64);

console.log("Key was written");
