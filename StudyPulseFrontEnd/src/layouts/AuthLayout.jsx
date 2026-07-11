import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#585be6]/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
