package com.examly.springapp.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

public class ExpenseRequest {

    @NotBlank(message = "Expense name is required")
    private String name;

    @Positive(message = "Amount should be greater than zero")
    private double amount;

    @NotBlank(message = "Category is required")
    private String category;

    public ExpenseRequest() {

    }

    public ExpenseRequest(String name, double amount, String category) {
        this.name = name;
        this.amount = amount;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}