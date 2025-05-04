import { useContext } from "react";
import { Route, Routes } from "react-router";
import { StoreContext } from "./context/store";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Requests from "./pages/Requests";
import AdminBooks from "./pages/AdminBooks";
import Categories from "./pages/Categories";
import AdminRequests from "./pages/AdminRequests";
import NotFound from "./pages/NotFound";

function App() {
  const [store] = useContext(StoreContext);
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<Layout />}>
        {store.role === "user" && (
          <>
            <Route path="books" element={<Books />} />
            <Route path="requests" element={<Requests />} />
          </>
        )}
        {store.role === "admin" && (
          <>
            <Route path="books" element={<AdminBooks />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="categories" element={<Categories />} />
          </>
        )}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
