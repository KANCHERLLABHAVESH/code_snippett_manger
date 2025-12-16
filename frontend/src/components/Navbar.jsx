import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo">
        Snippet Vault
      </Link>
      <div className="nav-links">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/snippets/new">New Snippet</Link>
            <Link to="/collections">Collections</Link>
          </>
        )}
        {!user && !isAuthPage && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (
          <button type="button" className="ghost-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

