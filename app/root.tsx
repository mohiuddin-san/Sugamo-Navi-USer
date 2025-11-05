import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import "~/styles/app.css";

// View Transition Wrapper
function ViewTransitionOutlet() {
  const location = useLocation();

  useEffect(() => {
    if (!document.startViewTransition) {
      return;
    }

    // প্রতিবার location চেঞ্জ হলে ট্রানজিশন শুরু
    const transition = document.startViewTransition(() => {
      // কিছু করার দরকার নেই – Remix নিজেই রিঅ্যাক্ট করবে
    });

    return () => {
      transition.finished.then(() => {
        // ট্রানজিশন শেষ হলে স্ক্রল রিস্টোর করো
      });
    };
  }, [location]);

  return <Outlet />;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <DeviceProvider>
          <ViewTransitionOutlet /> {/* এখানে Outlet wrap করলাম */}
        </DeviceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}