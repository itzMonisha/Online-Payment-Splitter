import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createExpense
} from "../services/expenseService";


function AddExpense() {

  const navigate =
    useNavigate();


  const [expense, setExpense] =
    useState({

      name: "",

      amount: "",

      category: ""

    });


  const [error, setError] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;


      setExpense(
        current => ({

          ...current,

          [name]: value

        })
      );

    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");


      if (
        !expense.name ||
        !expense.amount ||
        !expense.category
      ) {

        setError(
          "Please fill all fields."
        );

        return;
      }


      try {

        setLoading(true);


        await createExpense({

          name: expense.name,

          amount:
            Number(
              expense.amount
            ),

          category:
            expense.category

        });


        navigate("/");

      } catch (err) {

        setError(
          "Unable to create expense."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <main className="form-page">

      <div className="form-container">

        <p className="eyebrow">
          EXPENSE MANAGEMENT
        </p>


        <h1>
          Add Expense
        </h1>


        <p>
          Record a new shared expense.
        </p>


        {error && (

          <div
            className="error-box"
            role="alert"
          >
            {error}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="expense-form"
        >

          <label htmlFor="name">
            Expense Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={expense.name}
            onChange={handleChange}
            placeholder="Enter expense name"
            required
          />


          <label htmlFor="amount">
            Amount
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={expense.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />


          <label htmlFor="category">
            Category / Group
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={expense.category}
            onChange={handleChange}
            placeholder="Food / Friends / Group"
            required
          />


          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Add Expense"}
          </button>


          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Cancel
          </button>

        </form>

      </div>

    </main>
  );
}

export default AddExpense;