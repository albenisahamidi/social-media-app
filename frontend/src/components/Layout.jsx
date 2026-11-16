import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;