package com.examly.springapp.dto;


public class DashboardResponse {

    private long totalUsers;
    private long totalGroups;
    private long totalExpenses;
    private long totalSettlements;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalUsers,
            long totalGroups,
            long totalExpenses,
            long totalSettlements) {
        this.totalUsers = totalUsers;
        this.totalGroups = totalGroups;
        this.totalExpenses = totalExpenses;
        this.totalSettlements = totalSettlements;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalGroups() {
        return totalGroups;
    }

    public void setTotalGroups(long totalGroups) {
        this.totalGroups = totalGroups;
    }

    public long getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(long totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public long getTotalSettlements() {
        return totalSettlements;
    }

    public void setTotalSettlements(long totalSettlements) {
        this.totalSettlements = totalSettlements;
    }
}