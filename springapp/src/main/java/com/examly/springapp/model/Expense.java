package com.examly.springapp.model;

import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Expense name is required")
    private String name;

    @Positive(message = "Amount must be greater than zero")
    private double amount;

    @NotBlank(message = "Category is required")
    private String category;

    public Expense() {
    }

    public Expense(Long id, String name, double amount, String category) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.category = category;
    }

    public Expense(String name, double amount, String category) {
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