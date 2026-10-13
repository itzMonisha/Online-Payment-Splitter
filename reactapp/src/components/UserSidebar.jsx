import React from "react";
import {
  LayoutDashboard,
  Users,
  Receipt,
  ArrowLeftRight,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  WalletCards,
  HelpCircle
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import "./UserSidebar.css";

function UserSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("Unable to read user:", error);
  }

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const getInitial = () => {
    return userName
      .charAt(0)
      .toUpperCase();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <aside className="user-sidebar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="user-sidebar-logo">

        <div className="user-sidebar-logo-icon">
          <WalletCards size={24} />
        </div>

        <div>
          <h2>SplitPay</h2>
          <span>Payment Splitter</span>
        </div>

      </div>


      {/* =====================================================
          MAIN MENU
      ===================================================== */}

      <div className="user-sidebar-section">

        <p className="user-sidebar-heading">
          MAIN MENU
        </p>

        <button
          className={`user-sidebar-item ${
            isActive("/dashboard")
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard
            size={19}
            className="sidebar-icon dashboard-icon"
          />

          <span>Dashboard</span>
        </button>


        <button
          className={`user-sidebar-item ${
            isActive("/groups")
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/groups")}
        >
          <Users
            size={19}
            className="sidebar-icon groups-icon"
          />

          <span>Groups</span>
        </button>


        <button
          className={`user-sidebar-item ${
            isActive("/expenses")
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/expenses")}
        >
          <Receipt
            size={19}
            className="sidebar-icon expenses-icon"
          />

          <span>Expenses</span>
        </button>


        <button
          className={`user-sidebar-item ${
            isActive("/settlements")
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/settlements")}
        >
          <ArrowLeftRight
            size={19}
            className="sidebar-icon settlement-icon"
          />

          <span>Settlements</span>
        </button>

      </div>


      {/* =====================================================
          ACCOUNT
      ===================================================== */}

      <div className="user-sidebar-section account-section">

        <p className="user-sidebar-heading">
          ACCOUNT
        </p>


        <button
          className={`user-sidebar-item ${
            isActive("/notifications")
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/notifications")
          }
        >
          <Bell
            size={19}
            className="sidebar-icon notification-icon"
          />

          <span>Notifications</span>

          <span className="notification-dot"></span>

        </button>


        <button
          className={`user-sidebar-item ${
            isActive("/profile")
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/profile")
          }
        >
          <UserCircle
            size={19}
            className="sidebar-icon profile-icon"
          />

          <span>Profile</span>

        </button>


        <button
          className={`user-sidebar-item ${
            isActive("/settings")
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("/settings")
          }
        >
          <Settings
            size={19}
            className="sidebar-icon settings-icon"
          />

          <span>Settings</span>

        </button>

      </div>


      {/* =====================================================
          BOTTOM AREA
      ===================================================== */}

      <div className="user-sidebar-bottom">

        <div className="user-sidebar-help">

          <div className="help-icon">
            <HelpCircle size={18} />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>

        </div>


        <div className="user-sidebar-profile">

          <div className="user-profile-avatar">
            {getInitial()}
          </div>

          <div className="user-profile-info">
            <strong>{userName}</strong>
            <span>{user?.role || "USER"}</span>
          </div>

        </div>


        <button
          className="user-sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default UserSidebar;