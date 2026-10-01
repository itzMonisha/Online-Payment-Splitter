import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Home from '../components/Home';
import AddExpense from '../components/AddExpense';
import EditExpense from '../components/EditExpense';
import * as service from '../services/expenseService';

jest.mock('../services/expenseService');



test('State_renders_Home_component_with_heading', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  expect(screen.getByText(/All Expenses/i)).toBeInTheDocument();
});

test('State_renders_NavBar_component_links', () => {
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Expense/i)).toBeInTheDocument();
});

test('State_renders_Footer_component_text', () => {
  render(<Footer />);
  expect(screen.getByText(/2025 Expense Tracker App/i)).toBeInTheDocument();
});


test('State_renders_EditExpense_form_fields', async () => {
  service.getExpenseById.mockResolvedValue({ title: 'Tea', amount: '25', groupId: 'Food' });
  render(
    <BrowserRouter>
      <EditExpense />
    </BrowserRouter>
  );
  await waitFor(() => {
    expect(screen.getByDisplayValue('Tea')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
  });
});

test('State_displays_expenses_in_Home', async () => {
  service.getAllExpenses.mockResolvedValue([
    { id: 1, name: 'Coffee', amount: 50, category: 'Food' }
  ]);
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/Coffee - ₹50 - Food/i)).toBeInTheDocument();
  });
});


test('Form_submits_EditExpense_form', async () => {
  service.getExpenseById.mockResolvedValue({ title: 'Tea', amount: '25', groupId: 'Food' });
  service.updateExpense.mockResolvedValue({});
  render(
    <BrowserRouter>
      <EditExpense />
    </BrowserRouter>
  );
  await waitFor(() => {
    fireEvent.change(screen.getByDisplayValue('Tea'), { target: { value: 'Green Tea' } });
    fireEvent.click(screen.getByText(/Update/i));
  });
  await waitFor(() => {
    expect(service.updateExpense).toHaveBeenCalled();
  });
});

test('ErrorHandling_handles_empty_expense_list', async () => {
  service.getAllExpenses.mockResolvedValue([]);
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/All Expenses/i)).toBeInTheDocument();
  });
});

test('Axios_handles_error_during_getAllExpenses', async () => {
  service.getAllExpenses.mockRejectedValue(new Error('Failed'));
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/All Expenses/i)).toBeInTheDocument();
  });
});


test('ErrorHandling_handles_error_during_updateExpense', async () => {
  service.getExpenseById.mockResolvedValue({ title: 'Tea', amount: '25', groupId: 'Food' });
  service.updateExpense.mockRejectedValue(new Error('Update Failed'));
  render(
    <BrowserRouter>
      <EditExpense />
    </BrowserRouter>
  );
  await waitFor(() => {
    fireEvent.click(screen.getByText(/Update/i));
  });
  await waitFor(() => {
    expect(service.updateExpense).toHaveBeenCalled();
  });
});

test('State_renders_static_text_in_components', () => {
  render(<Footer />);
  expect(screen.getByText(/Expense Tracker App/i)).toBeInTheDocument();
});