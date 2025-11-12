// app/entry.client.tsx
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function hydrate() {
  hydrateRoot(
    document,
    <I18nextProvider i18n={i18n}>
      <RemixBrowser />
    </I18nextProvider>
  );
}

// যদি i18n ইতিমধ্যে ready থাকে (HMR)
if (i18n.isInitialized) {
  hydrate();
} else {
  i18n.on("initialized", hydrate);
}