import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllExpenses } from "../services/expenseService";

function ExpenseHistory() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD EXPENSES
  // =====================================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllExpenses();

      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (Array.isArray(data?.content)) {
        setExpenses(data.content);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Error loading expenses:", err);
      console.error("Backend response:", err?.response?.data);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
        "Unable to load expenses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const values = expenses
      .map((expense) => expense?.category)
      .filter(Boolean);

    return ["ALL", ...new Set(values)];
  }, [expenses]);

  // =====================================================
  // FILTER EXPENSES
  // =====================================================

  const filteredExpenses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return expenses.filter((expense) => {
      const name = String(
        expense?.name || ""
      ).toLowerCase();

      const categoryName = String(
        expense?.category || ""
      ).toLowerCase();

      const groupId = String(
        expense?.groupId || ""
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        name.includes(keyword) ||
        categoryName.includes(keyword) ||
        groupId.includes(keyword);

      const matchesCategory =
        category === "ALL" ||
        expense?.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) =>
        total + Number(expense?.amount || 0),
      0
    );
  }, [filteredExpenses]);

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportCSV = () => {
    if (filteredExpenses.length === 0) {
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Amount",
      "Category",
      "Group ID"
    ];

    const rows = filteredExpenses.map((expense) => [
      expense?.id ?? "",
      expense?.name ?? "",
      expense?.amount ?? "",
      expense?.category ?? "",
      expense?.groupId ?? ""
    ]);

    const csv = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value).replace(
              /"/g,
              '""'
            );

            return `"${safeValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "splitpay-expenses.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  // =====================================================
  // CATEGORY CLASS
  // =====================================================

  const getCategoryClass = (value) => {
    if (!value) {
      return "expense-category neutral";
    }

    const categoryValue =
      value.toLowerCase();

    if (
      categoryValue.includes("food") ||
      categoryValue.includes("meal") ||
      categoryValue.includes("dinner") ||
      categoryValue.includes("restaurant")
    ) {
      return "expense-category food";
    }

    if (
      categoryValue.includes("travel") ||
      categoryValue.includes("transport")
    ) {
      return "expense-category travel";
    }

    if (
      categoryValue.includes("shopping") ||
      categoryValue.includes("purchase")
    ) {
      return "expense-category shopping";
    }

    if (
      categoryValue.includes("bill") ||
      categoryValue.includes("utility")
    ) {
      return "expense-category bills";
    }

    return "expense-category neutral";
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="page">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              EXPENSE TRACKING
            </p>

            <h1>
              Expense History
            </h1>

            <p className="page-subtitle">
              Loading your shared expenses...
            </p>
          </div>
        </div>

        <div className="loading-card">
          <div className="loading-spinner"></div>

          <p>
            Loading expenses...
          </p>
        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="page">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="section-header">

        <div>

          <p className="eyebrow">
            EXPENSE TRACKING
          </p>

          <h1>
            Expense History
          </h1>

          <p className="page-subtitle">
            View, search and manage all your
            shared expenses.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={exportCSV}
          disabled={
            filteredExpenses.length === 0
          }
        >
          ↓ Export CSV
        </button>

      </div>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div className="error-box">
          {error}

          <button
            className="retry-button"
            onClick={loadExpenses}
          >
            Retry
          </button>
        </div>
      )}


      {/* =================================================
          SUMMARY CARDS
          ================================================= */}

      <div className="dashboard-stats">

        {/* TOTAL EXPENSE */}

        <div className="stat-card">

          <div className="stat-icon purple">
            ₹
          </div>

          <div>

            <span>
              Total Expenses
            </span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>

            <small>
              Across filtered records
            </small>

          </div>

        </div>


        {/* RECORDS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            #
          </div>

          <div>

            <span>
              Expense Records
            </span>

            <strong>
              {filteredExpenses.length}
            </strong>

            <small>
              Recorded expenses
            </small>

          </div>

        </div>


        {/* CATEGORIES */}

        <div className="stat-card">

          <div className="stat-icon green">
            ✓
          </div>

          <div>

            <span>
              Categories
            </span>

            <strong>
              {categories.length - 1}
            </strong>

            <small>
              Different categories
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          FILTER BAR
          ================================================= */}

      <div className="filter-bar">

        <div className="search-wrapper">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by expense, category or group..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="category-wrapper">

          <span>
            Category
          </span>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "ALL"
                  ? "All Categories"
                  : item}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* =================================================
          EXPENSE TABLE
          ================================================= */}

      <div className="expense-table-wrapper">

        {/* TABLE HEADER */}

        <div className="table-heading">

          <div>

            <h2>
              Recent Expenses
            </h2>

            <p>
              Your recorded shared expenses
            </p>

          </div>

          <span className="record-count">
            {filteredExpenses.length} records
          </span>

        </div>


        {/* TABLE */}

        {filteredExpenses.length > 0 ? (

          <div className="table-scroll">

            <table className="expense-table">

              <thead>

                <tr>

                  <th>
                    Expense
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Group
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredExpenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                    >

                      {/* EXPENSE */}

                      <td>

                        <div className="expense-name">

                          <div className="expense-avatar">
                            {String(
                              expense?.name ||
                              "E"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {expense?.name ||
                                "Unnamed expense"}
                            </strong>

                            <small>
                              Expense #
                              {expense?.id ??
                                "N/A"}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <span className="expense-amount">
                          ₹
                          {Number(
                            expense?.amount ||
                              0
                          ).toFixed(2)}
                        </span>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span
                          className={getCategoryClass(
                            expense?.category
                          )}
                        >
                          {expense?.category ||
                            "General"}
                        </span>

                      </td>


                      {/* GROUP */}

                      <td>

                        {expense?.groupId ? (

                          <span className="group-badge">
                            Group #
                            {expense.groupId}
                          </span>

                        ) : (

                          <span className="no-group">
                            No group
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
             ================================================= */

          <div className="empty-card">

            <div className="empty-icon">
              ₹
            </div>

            <h3>
              No expenses found
            </h3>

            <p>
              {search || category !== "ALL"
                ? "Try changing your search or category filter."
                : "Your recorded expenses will appear here."}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default ExpenseHistory;