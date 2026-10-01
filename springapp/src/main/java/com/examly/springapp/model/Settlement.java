
package com.examly.springapp.model;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@Entity
@Table(name = "settlements")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Payer Id is required")
    private Long payerId;

    @NotNull(message = "Receiver Id is required")
    private Long receiverId;

    @Positive(message = "Amount must be greater than zero")
    private double amount;

    @NotNull(message = "Status is required")
    private String status;

    @NotNull(message = "Settlement Date is required")
    private LocalDate settlementDate;

    // Default Constructor
    public Settlement() {
    }

    // Parameterized Constructor
    public Settlement(Long id, Long payerId, Long receiverId,
            double amount, String status,
            LocalDate settlementDate) {
        this.id = id;
        this.payerId = payerId;
        this.receiverId = receiverId;
        this.amount = amount;
        this.status = status;
        this.settlementDate = settlementDate;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPayerId() {
        return payerId;
    }

    public void setPayerId(Long payerId) {
        this.payerId = payerId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getSettlementDate() {
        return settlementDate;
    }

    public void setSettlementDate(LocalDate settlementDate) {
        this.settlementDate = settlementDate;
    }

}