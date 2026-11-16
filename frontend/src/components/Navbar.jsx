import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-600">
            SocialApp
          </Link>

          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <img
                src={`http://localhost:5001${user.avatar}`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                {user?.firstName?.charAt(0)?.toUpperCase() ||
                  user?.username?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            )}

            <span className="text-sm text-gray-600">
              {user?.username || user?.firstName || "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;