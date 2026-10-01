package com.examly.springapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.AdminDashboardResponse;
import com.examly.springapp.dto.AdminUserResponse;
import com.examly.springapp.model.Expense;
import com.examly.springapp.model.Group;
import com.examly.springapp.model.Settlement;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ExpenseRepository;
import com.examly.springapp.repository.GroupRepository;
import com.examly.springapp.repository.SettlementRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    /*
     * ==========================================
     * ADMIN DASHBOARD
     * ==========================================
     */

    public AdminDashboardResponse getDashboard() {

        long totalUsers = userRepository.count();

        long totalGroups = groupRepository.count();

        long totalExpenses = expenseRepository.count();

        long totalSettlements = settlementRepository.count();

        return new AdminDashboardResponse(

                totalUsers,

                totalGroups,

                totalExpenses,

                totalSettlements);

    }

    /*
     * ==========================================
     * GET ALL USERS
     * ==========================================
     */

    public List<AdminUserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<AdminUserResponse> response = new ArrayList<>();

        for (User user : users) {

            response.add(

                    new AdminUserResponse(

                            user.getId(),

                            user.getName(),

                            user.getEmail(),

                            user.getPhone(),

                            user.getRole()));

        }

        return response;
    }

    /*
     * ==========================================
     * GET USER BY ID
     * ==========================================
     */

    public AdminUserResponse getUserById(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        return new AdminUserResponse(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getPhone(),

                user.getRole());

    }

    /*
     * ==========================================
     * UPDATE USER
     * ==========================================
     */

    public AdminUserResponse updateUser(Long id, User updatedUser) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setRole(updatedUser.getRole());

        User savedUser = userRepository.save(user);

        return new AdminUserResponse(

                savedUser.getId(),

                savedUser.getName(),

                savedUser.getEmail(),

                savedUser.getPhone(),

                savedUser.getRole());

    }

    /*
     * ==========================================
     * DELETE USER
     * ==========================================
     */

    public boolean deleteUser(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return false;
        }

        userRepository.delete(user);

        return true;

    }

    /*
     * ==========================================
     * GET ALL GROUPS
     * ==========================================
     */

    public List<Group> getAllGroups() {

        return groupRepository.findAll();

    }

    /*
     * ==========================================
     * GET GROUP BY ID
     * ==========================================
     */

    public Group getGroupById(Long id) {

        return groupRepository.findById(id).orElse(null);

    }

    /*
     * ==========================================
     * UPDATE GROUP
     * ==========================================
     */

    public Group updateGroup(Long id, Group updatedGroup) {

        Group group = groupRepository.findById(id).orElse(null);

        if (group == null) {
            return null;
        }

        group.setGroupName(updatedGroup.getGroupName());
        group.setDescription(updatedGroup.getDescription());
        group.setCreatedDate(updatedGroup.getCreatedDate());
        group.setOwnerId(updatedGroup.getOwnerId());

        return groupRepository.save(group);

    }

    /*
     * ==========================================
     * DELETE GROUP
     * ==========================================
     */

    public boolean deleteGroup(Long id) {

        Group group = groupRepository.findById(id).orElse(null);

        if (group == null) {
            return false;
        }

        groupRepository.delete(group);

        return true;

    }
    /*
     * ==========================================
     * GET ALL EXPENSES
     * ==========================================
     */

    public List<Expense> getAllExpenses() {

        return expenseRepository.findAll();

    }

    /*
     * ==========================================
     * GET EXPENSE BY ID
     * ==========================================
     */

    public Expense getExpenseById(Long id) {

        return expenseRepository.findById(id).orElse(null);

    }

    /*
     * ==========================================
     * UPDATE EXPENSE
     * ==========================================
     */

    public Expense updateExpense(Long id, Expense updatedExpense) {

        Expense expense = expenseRepository.findById(id).orElse(null);

        if (expense == null) {
            return null;
        }

        expense.setName(updatedExpense.getName());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());

        return expenseRepository.save(expense);

    }

    /*
     * ==========================================
     * DELETE EXPENSE
     * ==========================================
     */

    public boolean deleteExpense(Long id) {

        Expense expense = expenseRepository.findById(id).orElse(null);

        if (expense == null) {
            return false;
        }

        expenseRepository.delete(expense);

        return true;

    }

    /*
     * ==========================================
     * GET ALL SETTLEMENTS
     * ==========================================
     */

    public List<Settlement> getAllSettlements() {

        return settlementRepository.findAll();

    }

    /*
     * ==========================================
     * GET SETTLEMENT BY ID
     * ==========================================
     */

    public Settlement getSettlementById(Long id) {

        return settlementRepository.findById(id).orElse(null);

    }

    /*
     * ==========================================
     * UPDATE SETTLEMENT
     * ==========================================
     */

    public Settlement updateSettlement(Long id, Settlement updatedSettlement) {

        Settlement settlement = settlementRepository.findById(id).orElse(null);

        if (settlement == null) {
            return null;
        }

        settlement.setPayerId(updatedSettlement.getPayerId());
        settlement.setReceiverId(updatedSettlement.getReceiverId());
        settlement.setAmount(updatedSettlement.getAmount());
        settlement.setStatus(updatedSettlement.getStatus());
        settlement.setSettlementDate(updatedSettlement.getSettlementDate());

        return settlementRepository.save(settlement);

    }

    /*
     * ==========================================
     * DELETE SETTLEMENT
     * ==========================================
     */

    public boolean deleteSettlement(Long id) {

        Settlement settlement = settlementRepository.findById(id).orElse(null);

        if (settlement == null) {
            return false;
        }

        settlementRepository.delete(settlement);

        return true;

    }

}
