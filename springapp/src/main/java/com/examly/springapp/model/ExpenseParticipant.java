package com.examly.springapp.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@Entity
@Table(name = "expense_participants")
public class ExpenseParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Expense Id is required")
    private Long expenseId;

    @NotNull(message = "Participant Id is required")
    private Long participantId;

    @Positive(message = "Amount owed must be greater than zero")
    private double amountOwed;

    public ExpenseParticipant() {
    }

    public ExpenseParticipant(Long id,
            Long expenseId,
            Long participantId,
            double amountOwed) {

        this.id = id;
        this.expenseId = expenseId;
        this.participantId = participantId;
        this.amountOwed = amountOwed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExpenseId() {
        return expenseId;
    }

    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public double getAmountOwed() {
        return amountOwed;
    }

    public void setAmountOwed(double amountOwed) {
        this.amountOwed = amountOwed;
    }

}