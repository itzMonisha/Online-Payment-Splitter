package com.examly.springapp.dto;

import java.time.LocalDate;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class SettlementRequest {

    @NotNull(message = "Payer Id is required")
    private Long payerId;

    @NotNull(message = "Receiver Id is required")
    private Long receiverId;

    @Positive(message = "Amount should be greater than zero")
    private double amount;

    private String status;

    private LocalDate settlementDate;

    public SettlementRequest() {

    }

    public SettlementRequest(Long payerId,
            Long receiverId,
            double amount,
            String status,
            LocalDate settlementDate) {

        this.payerId = payerId;
        this.receiverId = receiverId;
        this.amount = amount;
        this.status = status;
        this.settlementDate = settlementDate;
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