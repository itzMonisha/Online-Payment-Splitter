// package com.examly.springapp.service;

// import java.util.List;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.examly.springapp.model.Expense;
// import com.examly.springapp.repository.ExpenseRepository;

// @Service
// public class ExpenseService {

//     @Autowired
//     private ExpenseRepository expenseRepository;

//     /*
//      * Create Expense
//      */
//     public Expense createExpense(Expense expense) {

//         return expenseRepository.save(expense);

//     }

//     /*
//      * Get All Expenses
//      */
//     public List<Expense> getAllExpenses() {

//         return expenseRepository.findAll();

//     }

// <<<<<<< HEAD
//     /*
//      * Get Expense By Id
//      */
// =======
//     // Get Expense By Idipoh9
// >>>>>>> origin/Online-Payment-Splitter-App-itzMonisha
//     public Expense getExpenseById(Long id) {

//         Optional<Expense> optionalExpense = expenseRepository.findById(id);

//         if (optionalExpense.isPresent()) {

//             return optionalExpense.get();

//         }

//         return null;

//     }

//     /*
//      * Update Expense
//      */
//     public Expense updateExpense(Long id, Expense expense) {

//         Optional<Expense> optionalExpense = expenseRepository.findById(id);

//         if (optionalExpense.isPresent()) {

//             Expense existingExpense = optionalExpense.get();

//             existingExpense.setName(expense.getName());
//             existingExpense.setAmount(expense.getAmount());
//             existingExpense.setCategory(expense.getCategory());

//             return expenseRepository.save(existingExpense);

//         }

//         return null;

//     }

//     /*
//      * Delete Expense
//      */
//     public boolean deleteExpense(Long id) {

//         if (expenseRepository.existsById(id)) {

//             expenseRepository.deleteById(id);

//             return true;

//         }

//         return false;

//     }

//     /*
//      * Get Expenses By Category
//      */
//     public List<Expense> getExpensesByCategory(String category) {

//         return expenseRepository.findByCategory(category);

//     }

//     // Update Expense
//     public Expense updateExpense(Long id, Expense expense) {

//         Expense existingExpense = expenseRepository.findById(id).orElse(null);

//         if (existingExpense != null) {

//             existingExpense.setName(expense.getName());
//             existingExpense.setAmount(expense.getAmount());
//             existingExpense.setCategory(expense.getCategory());

//             return expenseRepository.save(existingExpense);
//         }

//         return null;
//     }

//     // Delete Expense
//     public boolean deleteExpense(Long id) {

//         if (expenseRepository.existsById(id)) {
//             expenseRepository.deleteById(id);
//             return true;
//         }

//         return false;
//     }

//     // Filter by Category
//     public List<Expense> getExpensesByCategory(String category) {
//         return expenseRepository.findByCategory(category);
//     }

// }
package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Expense;
import com.examly.springapp.repository.ExpenseRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Create Expense
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Get All Expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Get Expense By Id
    public Expense getExpenseById(Long id) {
        Optional<Expense> optionalExpense =
                expenseRepository.findById(id);

        return optionalExpense.orElse(null);
    }

    // Update Expense
    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense =
                expenseRepository.findById(id).orElse(null);

        if (existingExpense != null) {
            existingExpense.setName(expense.getName());
            existingExpense.setAmount(expense.getAmount());
            existingExpense.setCategory(expense.getCategory());

            return expenseRepository.save(existingExpense);
        }

        return null;
    }

    // Delete Expense
    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }

        return false;
    }

    // Get Expenses By Category
    public List<Expense> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category);
    }
}