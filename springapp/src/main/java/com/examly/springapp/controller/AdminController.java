package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Group;
import com.examly.springapp.model.Expense;

import com.examly.springapp.service.UserService;
import com.examly.springapp.service.GroupService;
import com.examly.springapp.service.ExpenseService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private ExpenseService expenseService;

    // Dashboard Summary
    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {

        return ResponseEntity.ok("Admin Dashboard");

    }

    // All Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers());

    }

    // All Groups
    @GetMapping("/groups")
    public ResponseEntity<List<Group>> getGroups() {

        return ResponseEntity.ok(
                groupService.getAllGroups());

    }

    // All Expenses
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getExpenses() {

        return ResponseEntity.ok(
                expenseService.getAllExpenses());

    }

    // Delete User
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");
    }

    // Delete Group
    @DeleteMapping("/groups/{id}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long id) {

        groupService.deleteGroup(id);

        return ResponseEntity.ok("Group deleted successfully");
    }

    // Delete Expense
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.ok("Expense deleted successfully");
    }

}