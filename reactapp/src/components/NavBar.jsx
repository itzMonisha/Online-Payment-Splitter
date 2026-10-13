import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    user = null;
  }

  const storedRole =
    localStorage.getItem("role");

  const role =
    user?.role ||
    storedRole ||
    "USER";

  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  

  const getInitial = () => {
    return userName
      .charAt(0)
      .toUpperCase();
  };

  const isActive = (path) => {
    if (path === "/groups") {
      return (
        location.pathname === "/groups" ||
        location.pathname.startsWith("/groups/")
      );
    }

    if (path === "/expenses") {
      return (
        location.pathname === "/expenses" ||
        location.pathname.startsWith("/expenses/")
      );
    }

    return location.pathname === path;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true
    });
  };

  if (!token) {
    return null;
  }

  return (
    <header className="top-navbar">

      {/* =================================================
          BRAND
          ================================================= */}

      <Link
        to="/dashboard"
        className="navbar-brand"
      >

        <div className="navbar-brand-icon">
          $
        </div>

        <div className="navbar-brand-text">

          <span className="navbar-brand-name">
            SplitPay
          </span>

          <span className="navbar-brand-subtitle">
            Payment Splitter
          </span>

        </div>

      </Link>


      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav className="navbar-menu">

        <Link
          to="/dashboard"
          className={
            `navbar-link ${
              isActive("/dashboard")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon">
            ◇
          </span>

          <span>
            Dashboard
          </span>
        </Link>


        <Link
          to="/groups"
          className={
            `navbar-link ${
              isActive("/groups")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon">
            ♧
          </span>

          <span>
            Groups
          </span>
        </Link>


        <Link
          to="/expenses"
          className={
            `navbar-link ${
              isActive("/expenses")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon">
            ₹
          </span>

          <span>
            Expenses
          </span>
        </Link>


        <Link
          to="/settlements"
          className={
            `navbar-link ${
              isActive("/settlements")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon">
            ↔
          </span>

          <span>
            Settlements
          </span>
        </Link>


        <Link
          to="/notifications"
          className={
            `navbar-link ${
              isActive("/notifications")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon notification-icon">
            ♧

            <span className="notification-dot" />
          </span>

          <span>
            Notifications
          </span>
        </Link>


        <Link
          to="/profile"
          className={
            `navbar-link ${
              isActive("/profile")
                ? "active"
                : ""
            }`
          }
        >
          <span className="navbar-link-icon">
            ○
          </span>

          <span>
            Profile
          </span>
        </Link>


        {/* =================================================
            ADMIN
            ================================================= */}

        {role.toUpperCase() === "ADMIN" && (
          <Link
            to="/admin-dashboard"
            className={
              `navbar-link admin-nav-link ${
                isActive("/admin-dashboard")
                  ? "active"
                  : ""
              }`
            }
          >
            <span className="navbar-link-icon">
              ◆
            </span>

            <span>
              Admin
            </span>
          </Link>
        )}

      </nav>


      {/* =================================================
          USER AREA
          ================================================= */}

      <div className="navbar-user-area">

        <Link
          to="/profile"
          className="navbar-user"
        >

          <div className="navbar-avatar">
            {getInitial()}
          </div>

          <div className="navbar-user-details">

            <span className="navbar-user-name">
              {userName}
            </span>

            <span className="navbar-user-role">
              {role}
            </span>

          </div>

        </Link>


        <button
          type="button"
          className="navbar-logout"
          onClick={logout}
          title="Logout"
        >
          <span>
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}

export default NavBar;