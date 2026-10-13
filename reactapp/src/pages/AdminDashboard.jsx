import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import Sidebar from "../components/Sidebar";

import {
  Users,
  UserCheck,
  UsersRound,
  Receipt,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  IndianRupee,
  Activity,
  Bell,
  Trash2,
  Eye,
  RefreshCw,
  ShieldCheck,
  Search,
  AlertCircle
} from "lucide-react";

import {
  getAllUsers,
  deleteUser
} from "../services/userService";

import {
  getGroups,
  deleteGroup
} from "../services/groupService";

import {
  getAllExpenses
} from "../services/expenseService";

import {
  getSettlements
} from "../services/settlementService";

import {
  getNotifications
} from "../services/notificationService";


function AdminDashboard() {
  // Rendered by Dashboard.jsx when the authenticated role is ADMIN.

  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // Platform-wide notifications.
  // Admins should see notifications from all users.
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userSearch, setUserSearch] = useState("");

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {

    try {

      setLoading(true);

      const results = await Promise.allSettled([
        getAllUsers(),
        getGroups(),
        getAllExpenses(),
        getSettlements(),
        getNotifications()
      ]);

      const usersResult = results[0];
      const groupsResult = results[1];
      const expensesResult = results[2];
      const settlementsResult = results[3];
      const notificationsResult = results[4];

      if (usersResult.status === "fulfilled") {
        setUsers(
          Array.isArray(usersResult.value)
            ? usersResult.value
            : []
        );
      }

      if (groupsResult.status === "fulfilled") {
        setGroups(
          Array.isArray(groupsResult.value)
            ? groupsResult.value
            : []
        );
      }

      if (expensesResult.status === "fulfilled") {
        setExpenses(
          Array.isArray(expensesResult.value)
            ? expensesResult.value
            : []
        );
      }

      if (settlementsResult.status === "fulfilled") {
        setSettlements(
          Array.isArray(settlementsResult.value)
            ? settlementsResult.value
            : []
        );
      }

      if (notificationsResult.status === "fulfilled") {
        setNotifications(
          Array.isArray(notificationsResult.value)
            ? notificationsResult.value
            : []
        );
      }

    } catch (error) {

      console.error(
        "Unable to load admin dashboard:",
        error
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadAdminData();

  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteUser = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteUser(id);

      setUsers(
        previousUsers =>
          previousUsers.filter(
            user => user.id !== id
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete user."
      );

    }
  };

  // =========================================================
  // DELETE GROUP
  // =========================================================

  const handleDeleteGroup = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteGroup(id);

      setGroups(
        previousGroups =>
          previousGroups.filter(
            group => group.id !== id
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete group."
      );

    }
  };

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const totalExpenseAmount = expenses.reduce(
    (total, expense) =>
      total +
      Number(
        expense.amount ||
        expense.totalAmount ||
        0
      ),
    0
  );

  const paidSettlements = settlements.filter(
    settlement =>
      settlement.settled === true ||
      settlement.status === "PAID" ||
      settlement.status === "SETTLED"
  ).length;

  const pendingSettlements =
    settlements.length -
    paidSettlements;

  const totalSettlementAmount =
    settlements.reduce(
      (total, settlement) =>
        total +
        Number(
          settlement.amount || 0
        ),
      0
    );

  const unreadNotifications =
    notifications.filter(
      notification =>
        notification &&
        notification.isRead !== true
    ).length;

  const latestNotifications =
    [...notifications]
      .sort(
        (a, b) =>
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
      )
      .slice(0, 8);

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = users.filter(
    user => {

      const search =
        userSearch
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (
        String(user.name || "")
          .toLowerCase()
          .includes(search) ||

        String(user.email || "")
          .toLowerCase()
          .includes(search) ||

        String(user.role || "")
          .toLowerCase()
          .includes(search)
      );

    }
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <div className="admin-page">

            <div className="admin-loading">

          <RefreshCw
            size={30}
            className="loading-icon"
          />

          <h2>
            Loading Admin Dashboard
          </h2>

          <p>
            Fetching users, groups,
            expenses and settlements...
          </p>

            </div>

          </div>

        </main>

      </div>

    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <div className="admin-page">

          {/* =====================================================
              HEADER
          ===================================================== */}

      <div className="admin-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="admin-subtitle">
            Monitor and manage the SplitPay
            platform from one place.
          </p>

        </div>

        <button
          className="admin-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* =====================================================
          ADMIN STATUS
          ===================================================== */}

      <div className="admin-status">

        <div className="admin-status-icon">

          <ShieldCheck size={20} />

        </div>

        <div>

          <strong>
            Administrator Access
          </strong>

          <span>
            You are managing the SplitPay
            application as an administrator.
          </span>

        </div>

        <div className="admin-status-badge">
          ACTIVE
        </div>

      </div>


      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="admin-stats-grid">


        {/* USERS */}

        <div className="admin-stat-card">

          <div className="stat-icon purple">

            <Users size={23} />

          </div>

          <div className="stat-content">

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

            <small>
              Registered accounts
            </small>

          </div>

        </div>


        {/* GROUPS */}

        <div className="admin-stat-card">

          <div className="stat-icon blue">

            <UsersRound size={23} />

          </div>

          <div className="stat-content">

            <span>
              Total Groups
            </span>

            <strong>
              {groups.length}
            </strong>

            <small>
              Shared expense groups
            </small>

          </div>

        </div>


        {/* EXPENSES */}

        <div className="admin-stat-card">

          <div className="stat-icon green">

            <Receipt size={23} />

          </div>

          <div className="stat-content">

            <span>
              Total Expenses
            </span>

            <strong>
              {expenses.length}
            </strong>

            <small>
              Recorded expenses
            </small>

          </div>

        </div>


        {/* SETTLEMENTS */}

        <div className="admin-stat-card">

          <div className="stat-icon orange">

            <ArrowLeftRight size={23} />

          </div>

          <div className="stat-content">

            <span>
              Settlements
            </span>

            <strong>
              {settlements.length}
            </strong>

            <small>
              Payment settlements
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
          FINANCIAL OVERVIEW
          ===================================================== */}

      <div className="admin-overview-grid">


        <div className="admin-overview-card">

          <div className="overview-icon green">

            <IndianRupee size={22} />

          </div>

          <div>

            <span>
              Total Expense Value
            </span>

            <strong>
              ₹{totalExpenseAmount.toFixed(2)}
            </strong>

            <small>
              Across all recorded expenses
            </small>

          </div>

        </div>


        <div className="admin-overview-card">

          <div className="overview-icon blue">

            <CheckCircle size={22} />

          </div>

          <div>

            <span>
              Completed Settlements
            </span>

            <strong>
              {paidSettlements}
            </strong>

            <small>
              Successfully settled payments
            </small>

          </div>

        </div>


        <div className="admin-overview-card">

          <div className="overview-icon red">

            <Clock size={22} />

          </div>

          <div>

            <span>
              Pending Settlements
            </span>

            <strong>
              {pendingSettlements}
            </strong>

            <small>
              Payments awaiting settlement
            </small>

          </div>

        </div>


        <div className="admin-overview-card">

          <div className="overview-icon purple">

            <ArrowLeftRight size={22} />

          </div>

          <div>

            <span>
              Settlement Value
            </span>

            <strong>
              ₹{totalSettlementAmount.toFixed(2)}
            </strong>

            <small>
              Total settlement amount
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK MANAGEMENT
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>

            <p>
              MANAGEMENT
            </p>

            <h2>
              Quick Access
            </h2>

          </div>

        </div>


        <div className="quick-actions">


          <button
            onClick={() =>
              window.location.href =
                "/groups"
            }
            className="quick-action purple"
          >

            <UsersRound size={22} />

            <div>

              <strong>
                Manage Groups
              </strong>

              <span>
                View and manage groups
              </span>

            </div>

          </button>


          <button
            onClick={() =>
              window.location.href =
                "/expenses"
            }
            className="quick-action green"
          >

            <Receipt size={22} />

            <div>

              <strong>
                Manage Expenses
              </strong>

              <span>
                Review shared expenses
              </span>

            </div>

          </button>


          <button
            onClick={() =>
              window.location.href =
                "/settlements"
            }
            className="quick-action orange"
          >

            <ArrowLeftRight size={22} />

            <div>

              <strong>
                Manage Settlements
              </strong>

              <span>
                Track payment settlements
              </span>

            </div>

          </button>


          <button
            onClick={() =>
              window.location.href =
                "/notifications"
            }
            className="quick-action blue"
          >

            <Activity size={22} />

            <div>

              <strong>
                View Notifications
              </strong>

              <span>
                Monitor platform activity
              </span>

            </div>

          </button>

        </div>

      </section>


      {/* =====================================================
          USER MANAGEMENT
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              ADMIN MANAGEMENT
            </p>

            <h2>
              User Management
            </h2>

            <span>
              Manage registered SplitPay users.
            </span>

          </div>

          <div className="section-count">

            <UserCheck size={17} />

            {users.length} Users

          </div>

        </div>


        <div className="admin-table-card">

          <div className="table-toolbar">

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search users by name, email or role..."
                value={userSearch}
                onChange={(e) =>
                  setUserSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <span>
              {filteredUsers.length} results
            </span>

          </div>


          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="table-empty"
                    >

                      <AlertCircle size={20} />

                      No users found.

                    </td>

                  </tr>

                ) : (

                  filteredUsers
                    .map(user => (

                      <tr key={user.id}>

                        <td>

                          <div className="user-cell">

                            <div className="user-avatar">

                              {String(
                                user.name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <strong>
                              {user.name ||
                                "Unknown User"}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {user.email ||
                            "—"}
                        </td>

                        <td>

                          <span
                            className={
                              String(
                                user.role
                              )
                                .toUpperCase() ===
                              "ADMIN"
                                ? "role-badge admin"
                                : "role-badge user"
                            }
                          >

                            {user.role ||
                              "USER"}

                          </span>

                        </td>

                        <td>

                          <span className="active-badge">

                            <span></span>

                            Active

                          </span>

                        </td>

                        <td>

                          <div className="table-actions">

                            <button
                              className="view-button"
                              title="View profile"
                              onClick={() =>
                                window.location.href =
                                  "/profile"
                              }
                            >

                              <Eye size={16} />

                            </button>

                            <button
                              className="delete-button"
                              title="Delete user"
                              onClick={() =>
                                handleDeleteUser(
                                  user.id
                                )
                              }
                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                )}

              </tbody>

            </table>

          </div>

          {filteredUsers.length > 10 && (

            <div className="table-footer">

              Showing first 10 users.
              Use search to find another user.

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          GROUP MANAGEMENT
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              GROUP MANAGEMENT
            </p>

            <h2>
              Groups
            </h2>

            <span>
              Monitor groups created in SplitPay.
            </span>

          </div>

          <div className="section-count blue-count">

            <UsersRound size={17} />

            {groups.length} Groups

          </div>

        </div>


        <div className="admin-group-grid">

          {groups.length === 0 ? (

            <div className="admin-empty-card">

              <UsersRound size={30} />

              <h3>
                No groups found
              </h3>

              <p>
                There are currently no groups
                available.
              </p>

            </div>

          ) : (

            groups
              .slice(0, 8)
              .map(group => (

                <div
                  className="admin-group-card"
                  key={group.id}
                >

                  <div className="group-card-top">

                    <div className="group-icon">

                      <UsersRound size={21} />

                    </div>

                    <span className="group-active">
                      Active
                    </span>

                  </div>


                  <h3>
                    {group.name ||
                      "Unnamed Group"}
                  </h3>

                  <p>
                    {group.description ||
                      "Shared expense group"}
                  </p>


                  <div className="group-card-footer">

                    <span>

                      <Users size={15} />

                      {group.memberCount !== undefined
                        ? `${group.memberCount} Members`
                        : "Shared Group"}

                    </span>


                    <button
                      className="group-delete-button"
                      onClick={() =>
                        handleDeleteGroup(
                          group.id
                        )
                      }
                    >

                      <Trash2 size={15} />

                      Delete

                    </button>

                  </div>

                </div>

              ))

          )}

        </div>

      </section>


      {/* =====================================================
          RECENT EXPENSES
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              EXPENSE MANAGEMENT
            </p>

            <h2>
              Recent Expenses
            </h2>

            <span>
              Latest expenses recorded on SplitPay.
            </span>

          </div>

          <button
            className="section-link-button"
            onClick={() =>
              window.location.href =
                "/expenses"
            }
          >

            View All
            <Eye size={16} />

          </button>

        </div>


        <div className="admin-table-card">

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    EXPENSE
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="table-empty"
                    >

                      No expenses found.

                    </td>

                  </tr>

                ) : (

                  expenses
                    .slice(0, 6)
                    .map(expense => (

                      <tr key={expense.id}>

                        <td>

                          <div className="expense-name">

                            <div className="expense-icon">

                              <Receipt size={16} />

                            </div>

                            <strong>
                              {expense.title ||
                                expense.description ||
                                "Expense"}
                            </strong>

                          </div>

                        </td>

                        <td>

                          <strong>
                            ₹
                            {Number(
                              expense.amount ||
                              expense.totalAmount ||
                              0
                            ).toFixed(2)}
                          </strong>

                        </td>

                        <td>

                          {expense.category ||
                            "General"}

                        </td>

                        <td>

                          <span className="active-badge">

                            <span></span>

                            Recorded

                          </span>

                        </td>

                      </tr>

                    ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* =====================================================
          SETTLEMENT OVERVIEW
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              PAYMENT MANAGEMENT
            </p>

            <h2>
              Settlement Overview
            </h2>

            <span>
              Monitor pending and completed settlements.
            </span>

          </div>

          <button
            className="section-link-button"
            onClick={() =>
              window.location.href =
                "/settlements"
            }
          >

            View All
            <Eye size={16} />

          </button>

        </div>


        <div className="settlement-summary-grid">


          <div className="settlement-summary-card completed">

            <div>

              <CheckCircle size={22} />

            </div>

            <span>
              Completed
            </span>

            <strong>
              {paidSettlements}
            </strong>

          </div>


          <div className="settlement-summary-card pending">

            <div>

              <Clock size={22} />

            </div>

            <span>
              Pending
            </span>

            <strong>
              {pendingSettlements}
            </strong>

          </div>


          <div className="settlement-summary-card total">

            <div>

              <ArrowLeftRight size={22} />

            </div>

            <span>
              Total Settlements
            </span>

            <strong>
              {settlements.length}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          PLATFORM NOTIFICATIONS
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              ACCOUNT ACTIVITY
            </p>

            <h2>
              Platform Notifications
            </h2>

            <span>
              View notification activity generated across SplitPay.
            </span>

          </div>

          <div className="section-count notification-count">

            <Activity size={17} />

            {notifications.length} Notifications

          </div>

        </div>


        <div className="notification-admin-panel">

          <div className="notification-admin-summary">

            <div className="notification-admin-summary-icon">
              <Bell size={21} />
            </div>

            <div>

              <span>
                Total Notifications
              </span>

              <strong>
                {notifications.length}
              </strong>

            </div>

            <div>

              <span>
                Unread
              </span>

              <strong>
                {unreadNotifications}
              </strong>

            </div>

            <button
              className="section-link-button"
              onClick={() =>
                window.location.href =
                  "/notifications"
              }
            >
              View All
              <Eye size={16} />
            </button>

          </div>


          {latestNotifications.length === 0 ? (

            <div className="notification-admin-empty">

              <Bell size={30} />

              <h3>
                No notifications yet
              </h3>

              <p>
                New platform activity will appear here.
              </p>

            </div>

          ) : (

            <div className="notification-admin-list">

              {latestNotifications.map(
                notification => (

                  <div
                    className="notification-admin-row"
                    key={notification.id}
                  >

                    <div className="notification-admin-icon">

                      <Bell size={17} />

                    </div>


                    <div className="notification-admin-content">

                      <strong>
                        {notification.title ||
                          notification.type ||
                          "Platform Notification"}
                      </strong>

                      <p>
                        {notification.message ||
                          notification.description ||
                          "Activity recorded in SplitPay."}
                      </p>

                      <div className="notification-admin-meta">

                        {notification.groupName && (
                          <span>
                            <Users size={12} />
                            {notification.groupName}
                          </span>
                        )}

                        {notification.expenseName && (
                          <span>
                            <Receipt size={12} />
                            {notification.expenseName}
                          </span>
                        )}

                        {notification.createdAt && (
                          <span>
                            <Clock size={12} />
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </span>
                        )}

                      </div>

                    </div>


                    <span
                      className={
                        notification.isRead === true
                          ? "notification-read-badge"
                          : "notification-unread-badge"
                      }
                    >
                      {notification.isRead === true
                        ? "READ"
                        : "UNREAD"}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          ADMIN DATA COVERAGE
          ===================================================== */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <p>
              PLATFORM COVERAGE
            </p>

            <h2>
              Information Available to Admin
            </h2>

            <span>
              The dashboard aggregates the main SplitPay backend resources.
            </span>

          </div>

        </div>


        <div className="admin-coverage-grid">

          <div className="admin-coverage-card">

            <Users size={21} />

            <div>

              <strong>
                Users
              </strong>

              <span>
                {users.length} registered accounts
              </span>

            </div>

          </div>


          <div className="admin-coverage-card">

            <UsersRound size={21} />

            <div>

              <strong>
                Groups
              </strong>

              <span>
                {groups.length} shared groups
              </span>

            </div>

          </div>


          <div className="admin-coverage-card">

            <Receipt size={21} />

            <div>

              <strong>
                Expenses
              </strong>

              <span>
                {expenses.length} expense records
              </span>

            </div>

          </div>


          <div className="admin-coverage-card">

            <ArrowLeftRight size={21} />

            <div>

              <strong>
                Settlements
              </strong>

              <span>
                {settlements.length} settlement records
              </span>

            </div>

          </div>


          <div className="admin-coverage-card">

            <Activity size={21} />

            <div>

              <strong>
                Notifications
              </strong>

              <span>
                {notifications.length} notification records
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
          ===================================================== */}

          <div className="admin-footer">

            <ShieldCheck size={17} />

            <span>
              SplitPay Administration Panel
            </span>

            <span>
              •
            </span>

            <span>
              Secure administrative access
            </span>

          </div>

        </div>

      </main>

    </div>

  );

}

export default AdminDashboard;