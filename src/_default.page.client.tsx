import { StrictMode } from "react";
import { Root, createRoot, hydrateRoot } from "react-dom/client";
import { PageContext } from "./types";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const clientRouting = true;

let root: Root;
export const render = ({ isHydration, Page, pageProps }: PageContext) => {
  const container = document.getElementById("root")!;
  const page = (
    <StrictMode>
      <HelmetProvider>
        <Page {...pageProps} />
      </HelmetProvider>
    </StrictMode>
  );
  if (isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
};
