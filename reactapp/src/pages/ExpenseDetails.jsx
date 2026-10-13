import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getExpenseById,
  deleteExpense
} from "../services/expenseService";

function ExpenseDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadExpense = async () => {

      try {

        const data =
          await getExpenseById(id);

        setExpense(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadExpense();

  }, [id]);

  const handleDelete = async () => {

    if (!window.confirm(
      "Delete this expense?"
    )) {
      return;
    }

    try {

      await deleteExpense(id);

      alert("Expense deleted.");

      if (expense?.groupId) {
        navigate(
          `/groups/${expense.groupId}`
        );
      } else {
        navigate("/expenses");
      }

    } catch (error) {

      alert(
        "Unable to delete expense."
      );

    }

  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-card">
          Loading expense...
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="page">
        <div className="empty-card">
          Expense not found.
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">

      <div className="details-card">

        <p className="eyebrow">
          EXPENSE DETAILS
        </p>

        <h1>{expense.name}</h1>

        <div className="details-row">
          <span>Amount</span>
          <strong>
            ₹{Number(expense.amount).toFixed(2)}
          </strong>
        </div>

        <div className="details-row">
          <span>Category</span>
          <strong>
            {expense.category}
          </strong>
        </div>

        <div className="details-row">
          <span>Group ID</span>
          <strong>
            {expense.groupId || "N/A"}
          </strong>
        </div>

        <div className="card-actions">

          <Link
            to={`/expenses/${expense.id}/edit`}
            className="primary-button"
          >
            Edit
          </Link>

          <button
            className="danger-button"
            onClick={handleDelete}
          >
            Delete
          </button>

          {expense.groupId && (
            <Link
              to={`/groups/${expense.groupId}`}
              className="secondary-button"
            >
              Back to Group
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}

export default ExpenseDetails;