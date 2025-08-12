import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import { useRouteError } from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <h1>Error</h1>
      <p>
        {typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Something went wrong"}
      </p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}