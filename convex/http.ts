import { httpRouter } from "convex/server";
import { chapaInitialize, chapaWebhook, chapaOptions } from "./payments";

const http = httpRouter();

http.route({
  path: "/chapa-initialize",
  method: "POST",
  handler: chapaInitialize,
});

http.route({
  path: "/chapa-initialize",
  method: "OPTIONS",
  handler: chapaOptions,
});

http.route({
  path: "/chapa-webhook",
  method: "POST",
  handler: chapaWebhook,
});

http.route({
  path: "/chapa-webhook",
  method: "OPTIONS",
  handler: chapaOptions,
});

export default http;
