import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllExpenses,
  deleteExpense
} from "../services/expenseService";

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadExpenses = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllExpenses();

      const expenseList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setExpenses(expenseList);
    } catch (err) {
      setExpenses([]);
      setError("Unable to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return expenses;
    }

    return expenses.filter((expense) => {
      const text = `
        ${expense.name || ""}
        ${expense.title || ""}
        ${expense.category || ""}
        ${expense.groupid || ""}
        ${expense.groupId || ""}
      `.toLowerCase();

      return text.includes(value);
    });
  }, [expenses, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) {
      return;
    }

    try {
      await deleteExpense(id);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      setError("Unable to delete expense.");
    }
  };

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  return (
    <main>

      {/* HERO SECTION */}
      <section className="hero">

        <div>
          <p className="eyebrow">
            ONLINE PAYMENT SPLITTER
          </p>

          <h1>
            Expense Tracker
          </h1>

          <p>
            Manage shared expenses, groups and
            settlements easily from one place.
          </p>

          <div className="hero-actions">

            <Link
              to="/add"
              className="primary-btn"
            >
              Add Expense
            </Link>

            <Link
              to="/groups"
              className="secondary-btn"
            >
              View Groups
            </Link>

          </div>
        </div>

        <div className="hero-stat">

          <span>
            Total Recorded
          </span>

          <strong>
            ₹{total.toFixed(2)}
          </strong>

          <small>
            {expenses.length} expense
            {expenses.length !== 1 ? "s" : ""}
          </small>

        </div>

      </section>


      {/* EXPENSE SECTION */}
      <section className="page content-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              All Expenses
            </h2>

          </div>

          <input
            className="search-input"
            aria-label="Search expenses"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* ERROR */}
        {error && (
          <div
            className="error-box"
            role="alert"
          >
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading ? (

          <div className="loading">
            Loading expenses...
          </div>

        ) : filteredExpenses.length === 0 ? (

          /* EMPTY STATE */
          <div className="empty-state">

            <h3>
              No expenses found
            </h3>

            <p>
              {expenses.length === 0
                ? "Your expense list is currently empty."
                : "No expense matches your search."}
            </p>

            {expenses.length === 0 && (
              <Link
                to="/add"
                className="primary-btn"
              >
                Add your first expense
              </Link>
            )}

          </div>

        ) : (

          /* EXPENSE LIST */
          <div className="expense-grid">

            {filteredExpenses.map((expense) => {

              const expenseName =
                expense.name ||
                expense.title ||
                "Unnamed Expense";

              const expenseCategory =
                expense.category ||
                expense.groupid ||
                expense.groupId ||
                "Shared expense";

              return (
                <article
                  className="expense-card"
                  key={expense.id}
                >

                  <div className="expense-icon">
                    ₹
                  </div>

                  <div className="expense-info">

                    <h3>
                      {expenseName}
                    </h3>

                    <span>
                      {expenseCategory}
                    </span>

                  </div>

                  <strong className="expense-amount">
                    ₹{Number(expense.amount || 0).toFixed(2)}
                  </strong>

                  <div className="card-actions">

                    <Link
                      to={`/edit/${expense.id}`}
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}

export default Home;