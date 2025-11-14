// app/i18n.server.ts
import { createCookie } from "@remix-run/node";
import i18next from "i18next";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

// Cookie
export const i18nextCookie = createCookie("i18next", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 365,
  secure: process.env.NODE_ENV === "production",
});

// Supported languages
const supportedLngs = ["en", "ja", "zh"];
const fallbackLng = "ja";

// Load translation file (SSR)
export async function loadTranslation(lng: string, ns: string = "translation") {
  const filePath = resolve(`./public/locales/${lng}/${ns}.json`);
  try {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    // Fallback to ja
    const fallbackPath = resolve(`./public/locales/${fallbackLng}/${ns}.json`);
    const data = readFileSync(fallbackPath, "utf-8");
    return JSON.parse(data);
  }
}

// Get locale from cookie or default
// app/i18n.server.ts
export async function getLocale(request: Request): Promise<string> {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/i18next=([^;]+)/);
  const lng = match ? match[1] : null;

  return ["en", "ja", "zh"].includes(lng!) ? lng! : "ja";
}

// Set locale
export async function setLocale(lng: string) {
  return {
    "Set-Cookie": await i18nextCookie.serialize(lng),
  };
}