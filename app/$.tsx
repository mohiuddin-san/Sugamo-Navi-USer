import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/.well-known/")) {
    return new Response(null, { status: 404 }); // Silently return 404
  }
  // Handle other unmatched routes if needed
  throw new Response("Not Found", { status: 404 });
}