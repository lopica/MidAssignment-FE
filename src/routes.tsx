import { useContext } from "react";
import { StoreContext } from "./context/store";
import { useAxiosInterceptor } from "./apis/axiosInstance";
import { useInitAuth } from "./hooks/useInitAuth";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import CustomLayout from "./components/Layout";
import Books from "./pages/Books";
import Requests from "./pages/Requests";
import AdminBooks from "./pages/AdminBooks";
import AdminRequests from "./pages/AdminRequests";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

function App() {
  const [store] = useContext(StoreContext);
  useAxiosInterceptor();

  // const { isLoading } = useInitAuth(); // ✅ use the flag

  // if (isLoading) return <div className="text-center mt-10 text-gray-500">Loading session...</div>;

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<CustomLayout />}>
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

export default App
