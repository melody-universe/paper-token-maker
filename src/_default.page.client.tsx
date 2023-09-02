import { StrictMode } from "react";
import { Root, createRoot, hydrateRoot } from "react-dom/client";
import { PageContext } from "./types";
import { HelmetProvider } from "react-helmet-async";

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
