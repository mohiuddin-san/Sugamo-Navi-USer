import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useEffect } from "react";
import "~/styles/app.css";

export const links = () => [
  { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&family=Cairo:wght@400;500;600;700&family=Courier+Prime&family=Cousine&display=swap",
  },
  { rel: "preload", href: "~/styles/app.css", as: "style" },
  { rel: "preload", href: "https://cdn.example.com/sugamo-navi.webp", as: "image" },
];

export const meta = () => [
  { charset: "utf-8" },
  { title: "Sugamo Navi" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <DeviceProvider>
          <Outlet />
        </DeviceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}