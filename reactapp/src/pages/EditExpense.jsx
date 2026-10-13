import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getExpenseById,
  updateExpense
} from "../services/expenseService";

function EditExpense() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    category: "",
    groupId: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {

    setExpense({
      ...expense,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!expense.name.trim()) {
      alert("Expense name is required.");
      return;
    }

    try {

      setSaving(true);

      await updateExpense(id, {
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category,
        groupId: expense.groupId
      });

      alert("Expense updated successfully.");

      navigate(
        expense.groupId
          ? `/groups/${expense.groupId}`
          : `/expenses/${id}`
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to update expense."
      );

    } finally {

      setSaving(false);

    }

  };

  if (loading) {
    return (
      <div className="page">
        Loading...
      </div>
    );
  }

  return (
    <div className="form-page">

      <div className="form-card">

        <p className="eyebrow">
          EXPENSE MANAGEMENT
        </p>

        <h1>Edit Expense</h1>

        <form onSubmit={handleSubmit}>

          <label>
            Expense Name
          </label>

          <input
            name="name"
            value={expense.name || ""}
            onChange={handleChange}
          />

          <label>
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={expense.amount || ""}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

          <label>
            Category
          </label>

          <input
            name="category"
            value={expense.category || ""}
            onChange={handleChange}
          />

          <label>
            Group ID
          </label>

          <input
            name="groupId"
            value={expense.groupId || ""}
            readOnly
          />

          <button
            className="primary-button full-width"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Expense"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditExpense;