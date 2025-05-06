import { Link } from "react-router";
import { Button } from "antd";
import { StoreContext } from "../context/store";
import { useContext, useEffect, useState } from "react";

export default function NotFound() {
    const [store] = useContext(StoreContext);
    const [link, setLink] = useState("/login");

    useEffect(() => {
        if (store.role !== "") setLink("/books")
        else setLink("/")
    }, [store]);

    return <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link to={link}>
        <Button type="primary">Go to Home</Button>
      </Link>
    </div>
}