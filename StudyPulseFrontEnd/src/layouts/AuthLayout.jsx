import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "20px",
        background: "#f4f4f5",
      }}
    >
      <Outlet />
    </div>
  );
}

export default AuthLayout;