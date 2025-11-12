import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useLocation } from "@remix-run/react";
import { useEffect,useRef } from "react";
import "~/styles/app.css";
import i18n from "./i18n";
import "./i18n";

function ViewTransitionOutlet() {
  const location = useLocation();

  useEffect(() => {
    if (!document.startViewTransition) return;

    const transition = document.startViewTransition(() => { });
    return () => {
      transition.finished.then(() => { });
    };
  }, [location]);

  return <Outlet />;
}

export const links = () => [
  { rel: "icon", href: "/favicon-v2.ico" },
];

export default function App() {
  const tiktokScriptRef = useRef<HTMLScriptElement | null>(null);
 useEffect(() => {
    // যদি আগে থেকে থাকে, তাহলে duplicate না করি
    if (tiktokScriptRef.current) return;

    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    script.dataset.cfasync = "false"; // optional: Cloudflare interference avoid

    document.body.appendChild(script);
    tiktokScriptRef.current = script; // ← ref-এ store

    return () => {
      // Safe remove: শুধু যদি parent থাকে
      if (tiktokScriptRef.current && tiktokScriptRef.current.parentNode) {
        tiktokScriptRef.current.parentNode.removeChild(tiktokScriptRef.current);
      }
      tiktokScriptRef.current = null;
    };
  }, []);
  return (
    <html >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <DeviceProvider>
          <ViewTransitionOutlet />
        </DeviceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
