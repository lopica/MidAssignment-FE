// Main.tsx or index.tsx
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import App from "./Routes.tsx";
import { BrowserRouter } from "react-router";
import { StoreContext } from "./context/store";
import { useMemo, useState } from "react";
import { StoreContextType, StoreType } from "./types.ts";
import { DEFAULT_STORE_VALUE } from "./context/default.ts";
import '@ant-design/v5-patch-for-react-19';

function Root() {
  const [store, setStore] = useState<StoreContextType>(DEFAULT_STORE_VALUE);

  const DEFAULT_STORE = useMemo<StoreType>(
    () => [store, setStore],
    [store, setStore]
  );

  return (
    <StoreContext.Provider value={DEFAULT_STORE}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
