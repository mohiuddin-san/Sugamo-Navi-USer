// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useEffect, useRef } from "react";
import "~/styles/app.css";
import { ErrorBoundary } from "~/components/ErrorBoundary"; // ← যোগ করো

function ViewTransitionOutlet() {
  const location = useLocation();
  const transitionRef = useRef<any>(null);

  useEffect(() => {
    if (!document.startViewTransition) return;

    // Cleanup previous transition
    if (transitionRef.current) {
      transitionRef.current.skipTransition?.();
    }

    try {
      const transition = document.startViewTransition(() => {});
      transitionRef.current = transition;

      transition.finished.finally(() => {
        transitionRef.current = null;
      });
    } catch (error) {
      console.warn("View transition failed (safe fallback):", error);
      // Ignore DOM errors during navigation
    }

    return () => {
      if (transitionRef.current) {
        transitionRef.current.skipTransition?.();
        transitionRef.current = null;
      }
    };
  }, [location]);

  return <Outlet />;
}

export const links = () => [
  { rel: "icon", href: "/favicon-v2.ico" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Cousine:wght@400;700&display=swap" },
];

export default function App() {
  const tiktokScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load TikTok script safely
    if (tiktokScriptRef.current) return; // Already loaded

    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    script.onload = () => console.log("TikTok embed script loaded");
    script.onerror = () => console.warn("Failed to load TikTok embed script");

    document.body.appendChild(script);
    tiktokScriptRef.current = script;

    return () => {
      if (tiktokScriptRef.current && document.body.contains(tiktokScriptRef.current)) {
        try {
          document.body.removeChild(tiktokScriptRef.current);
        } catch (e) {
          console.warn("Safe cleanup of TikTok script failed:", e);
        }
        tiktokScriptRef.current = null;
      }
    };
  }, []);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <DeviceProvider>
          <ErrorBoundary
            fallback={
              <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-red-50">
                <div className="text-red-500 text-6xl mb-4">Warning</div>
                <h2 className="text-xl font-bold text-red-700 mb-2">ページの読み込みに失敗しました</h2>
                <p className="text-red-600 text-center mb-4">
                  問題が発生しました。ページをリロードしてください。
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  リロード
                </button>
              </div>
            }
          >
            <ViewTransitionOutlet />
          </ErrorBoundary>
        </DeviceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}