package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    @Autowired
    private UserService userService;

    /*
     * -----------------------------------------
     * Create User
     * POST : /api/users
     * -----------------------------------------
     */

    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody User user) {

        User savedUser = userService.createUser(user);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    /*
     * -----------------------------------------
     * Get All Users
     * GET : /api/users
     * -----------------------------------------
     */

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    /*
     * -----------------------------------------
     * Get User By Id
     * GET : /api/users/{id}
     * -----------------------------------------
     */

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    /*
     * -----------------------------------------
     * Get User By Email
     * GET : /api/users/email/{email}
     * -----------------------------------------
     */

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(
            @PathVariable String email) {

        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    /*
     * -----------------------------------------
     * Update User
     * PUT : /api/users/{id}
     * -----------------------------------------
     */

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {

        User updatedUser = userService.updateUser(id, user);

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    /*
     * -----------------------------------------
     * Delete User
     * DELETE : /api/users/{id}
     * -----------------------------------------
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        boolean deleted = userService.deleteUser(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok("User deleted successfully");
    }

    /*
     * -----------------------------------------
     * Search Users
     * GET : /api/users/search/{keyword}
     * -----------------------------------------
     */

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<User>> searchUsers(
            @PathVariable String keyword) {

        List<User> users = userService.searchUsers(keyword);

        return ResponseEntity.ok(users);
    }

}