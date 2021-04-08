import React from "react";
import { ContextData } from "./types";

const GlobalContext = React.createContext<ContextData>({
  token: null,
  network: null,
  type: 1,
} as any);

export default GlobalContext;
