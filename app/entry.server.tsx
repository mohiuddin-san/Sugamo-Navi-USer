// app/entry.server.tsx
import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import i18next from "i18next";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // SSR-এর জন্য নতুন i18n instance
  const i18nInstance = i18n.cloneInstance({
    lng: i18next.language, // current language
  });

  const markup = renderToString(
    <I18nextProvider i18n={i18nInstance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}