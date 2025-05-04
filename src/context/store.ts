import { createContext } from "react";
import { StoreType } from "../types";

export const StoreContext = createContext<StoreType>(null!);
