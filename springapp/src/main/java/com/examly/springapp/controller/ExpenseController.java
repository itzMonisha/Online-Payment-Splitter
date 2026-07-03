package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Expense;
import com.examly.springapp.service.ExpenseService;

import javax.validation.Valid;
@RestController
@RequestMapping("/expenses")
@Validated
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Create Expense
    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        Expense savedExpense = expenseService.createExpense(expense);
        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }

    // Get All Expenses
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return new ResponseEntity<>(expenseService.getAllExpenses(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {

        Expense expense = expenseService.getExpenseById(id);

        if (expense == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(expense, HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense) {

        Expense updatedExpense = expenseService.updateExpense(id, expense);

        if (updatedExpense == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(updatedExpense, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {

        boolean deleted = expenseService.deleteExpense(id);

        if (deleted) {
            return new ResponseEntity<>("Expense deleted successfully", HttpStatus.OK);
        }

        return new ResponseEntity<>("Expense not found", HttpStatus.NOT_FOUND);
    }
	@GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String category) {

        return new ResponseEntity<>(
                expenseService.getExpensesByCategory(category),
                HttpStatus.OK);
    }
}