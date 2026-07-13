package com.examly.springapp.dto;

public class ExpenseResponse {

    private Long id;

    private String name;

    private double amount;

    private String category;

    public ExpenseResponse() {

    }

    public ExpenseResponse(Long id,
            String name,
            double amount,
            String category) {

        this.id = id;
        this.name = name;
        this.amount = amount;
        this.category = category;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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