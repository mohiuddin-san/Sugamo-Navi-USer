import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import "~/styles/app.css";

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
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <html lang="en">
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
