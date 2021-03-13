import React from "react";
import { ContextData } from "./types";

const GlobalContext = React.createContext<ContextData>({ token: null } as any);

export default GlobalContext;
