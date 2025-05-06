import { createContext } from "react";

export type StoreContextType = {
  userId: string;
  email: string;
  role: "admin" | "user" | "";
};

export const initialStore: StoreContextType = {
  userId: "",
  email: "",
  role: "",
};

export const StoreContext = createContext<
  [StoreContextType, (store: StoreContextType) => void]
>([initialStore, () => {}]);
