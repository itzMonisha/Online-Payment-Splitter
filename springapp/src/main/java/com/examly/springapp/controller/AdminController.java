package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.AdminUserResponse;

import com.examly.springapp.model.Expense;
import com.examly.springapp.model.Group;
import com.examly.springapp.model.Settlement;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ExpenseRepository;
import com.examly.springapp.repository.GroupRepository;
import com.examly.springapp.repository.SettlementRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.AdminService;
import com.examly.springapp.dto.DashboardResponse;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    /*
     * ======================================
     * ADMIN DASHBOARD
     * GET : /api/admin/dashboard
     * ======================================
     */

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        DashboardResponse dashboard = new DashboardResponse(

                userRepository.count(),

                groupRepository.count(),

                expenseRepository.count(),

                settlementRepository.count());

        return ResponseEntity.ok(dashboard);
    }

    /*
     * ======================================
     * GET ALL USERS
     * GET : /api/admin/users
     * ======================================
     */

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers());

    }

    /*
     * ======================================
     * GET USER BY ID
     * GET : /api/admin/users/{id}
     * ======================================
     */

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long id) {

        AdminUserResponse user = adminService.getUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    /*
     * ======================================
     * UPDATE USER
     * PUT : /api/admin/users/{id}
     * ======================================
     */

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        AdminUserResponse updatedUser = adminService.updateUser(id, user);

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }

    /*
     * ======================================
     * DELETE USER
     * DELETE : /api/admin/users/{id}
     * ======================================
     */

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        boolean deleted = adminService.deleteUser(id);

        if (!deleted) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        }

        return ResponseEntity.ok(
                "User deleted successfully");
    }

    /*
     * ======================================
     * GET ALL GROUPS
     * GET : /api/admin/groups
     * ======================================
     */

    @GetMapping("/groups")
    public ResponseEntity<List<Group>> getAllGroups() {

        return ResponseEntity.ok(
                adminService.getAllGroups());

    }

    /*
     * ======================================
     * GET GROUP BY ID
     * GET : /api/admin/groups/{id}
     * ======================================
     */

    @GetMapping("/groups/{id}")
    public ResponseEntity<Group> getGroupById(
            @PathVariable Long id) {

        Group group = adminService.getGroupById(id);

        if (group == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(group);

    }

    /*
     * ======================================
     * UPDATE GROUP
     * PUT : /api/admin/groups/{id}
     * ======================================
     */

    @PutMapping("/groups/{id}")
    public ResponseEntity<Group> updateGroup(

            @PathVariable Long id,

            @RequestBody Group group) {

        Group updatedGroup = adminService.updateGroup(id, group);

        if (updatedGroup == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedGroup);

    }

    /*
     * ======================================
     * DELETE GROUP
     * DELETE : /api/admin/groups/{id}
     * ======================================
     */

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long id) {

        boolean deleted = adminService.deleteGroup(id);

        if (!deleted) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Group not found");

        }

        return ResponseEntity.ok(
                "Group deleted successfully");

    }

    /*
     * ======================================
     * GET ALL EXPENSES
     * GET : /api/admin/expenses
     * ======================================
     */

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getAllExpenses() {

        return ResponseEntity.ok(
                adminService.getAllExpenses());

    }

    /*
     * ======================================
     * DELETE EXPENSE
     * DELETE : /api/admin/expenses/{id}
     * ======================================
     */

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        boolean deleted = adminService.deleteExpense(id);

        if (!deleted) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Expense not found");

        }

        return ResponseEntity.ok(
                "Expense deleted successfully");

    }

    /*
     * ======================================
     * GET ALL SETTLEMENTS
     * GET : /api/admin/settlements
     * ======================================
     */

    @GetMapping("/settlements")
    public ResponseEntity<List<Settlement>> getAllSettlements() {

        return ResponseEntity.ok(
                adminService.getAllSettlements());

    }

    /*
     * ======================================
     * DELETE SETTLEMENT
     * DELETE : /api/admin/settlements/{id}
     * ======================================
     */

    @DeleteMapping("/settlements/{id}")
    public ResponseEntity<String> deleteSettlement(
            @PathVariable Long id) {

        boolean deleted = adminService.deleteSettlement(id);

        if (!deleted) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Settlement not found");

        }

        return ResponseEntity.ok(
                "Settlement deleted successfully");

    }

}
