import { createRequestHandler } from "@remix-run/netlify";
import * as build from "@remix-run/dev/server-build";

export default createRequestHandler({
    build: build as any,
    mode: process.env.NODE_ENV,
});