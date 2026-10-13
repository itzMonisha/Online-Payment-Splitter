import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getExpenseById,
  updateExpense
} from "../services/expenseService";


function EditExpense() {

  const { id } =
    useParams();

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
    useState(true);


  useEffect(() => {

    const loadExpense =
      async () => {

        try {

          const data =
            await getExpenseById(id);


          setExpense({

            name:
              data?.name ||
              data?.title ||
              "",

            amount:
              data?.amount ?? "",

            category:
              data?.category ||
              data?.groupid ||
              data?.groupId ||
              ""

          });

        } catch (err) {

          setError(
            "Unable to load expense."
          );

        } finally {

          setLoading(false);

        }

      };


    loadExpense();

  }, [id]);


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


      try {

        await updateExpense(
          id,
          {

            name:
              expense.name,

            amount:
              Number(
                expense.amount
              ),

            category:
              expense.category

          }
        );


        navigate("/");

      } catch (err) {

        setError(
          "Unable to update expense."
        );

      }

    };


  if (loading) {

    return (
      <main className="form-page">

        <div className="loading">
          Loading expense...
        </div>

      </main>
    );

  }


  return (

    <main className="form-page">

      <div className="form-container">

        <p className="eyebrow">
          EXPENSE MANAGEMENT
        </p>


        <h1>
          Edit Expense
        </h1>


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
            required
          />


          <button
            type="submit"
            className="primary-btn"
          >
            Update Expense
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

export default EditExpense;