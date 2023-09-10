import { FunctionComponent } from "react";

export type PageContext = {
  isHydration: boolean;
  Page: FunctionComponent;
  pageProps: object;
};
