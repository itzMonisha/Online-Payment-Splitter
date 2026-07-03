package com.examly.springapp;

import com.examly.springapp.model.Expense;
import com.examly.springapp.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SpringappApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExpenseRepository expenseRepository;

    @BeforeEach
    public void clearRepo() {
        expenseRepository.deleteAll(); // optional: resets state before each test
    }

    // ✅ Day 1 - Context Load Test
    @Test
    public void contextLoads() {
        assertThat(expenseRepository).isNotNull();
    }

    // ✅ Day 2 - Controller Mapping Check
    @Test
    public void controller_ShouldRespondWith200() throws Exception {
        mockMvc.perform(get("/expenses"))
                .andExpect(status().isOk());
    }

    // ✅ Day 3 - Create Expense and Check Response
    @Test
    public void controller_shouldCreateExpense() throws Exception {
        String expenseJson = "{\"name\":\"Lunch\",\"amount\":150.0,\"category\":\"Food\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expenseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Lunch"))
                .andExpect(jsonPath("$.category").value("Food"))
                .andExpect(jsonPath("$.amount").value(150.0));
    }

    // ✅ Day 3 - Fetch All Expenses
    @Test
    public void controller_shouldReturnAllExpenses() throws Exception {
        expenseRepository.save(new Expense("Dinner", 200.0, "Food"));
        mockMvc.perform(get("/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dinner"));
    }

    // ✅ Day 4 - Entity Mapping Validation
    @Test
    public void entity_shouldSaveExpenseInRepository() {
        Expense expense = new Expense("Taxi", 100.0, "Transport");
        Expense saved = expenseRepository.save(expense);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Taxi");
        assertThat(saved.getAmount()).isEqualTo(100.0);
        assertThat(saved.getCategory()).isEqualTo("Transport");
    }

    // ✅ Day 5 - Filter by Category
    @Test
    public void controller_shouldFilterExpensesByCategory() throws Exception {
        expenseRepository.save(new Expense("Pizza", 300.0, "Food"));
        mockMvc.perform(get("/expenses?category=Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Food"));
    }

    // ✅ Day 6 - Invalid Payload Handling
    @Test
    public void exception_shouldRejectInvalidExpensePayload() throws Exception {
        String invalidJson = "{\"name\":\"\",\"amount\":-50,\"category\":\"\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
    @Test
    public void controller_shouldCreateExpenseWithDecimalAmount() throws Exception {
        String expenseJson = "{\"name\":\"Groceries\",\"amount\":123.45,\"category\":\"Shopping\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expenseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(123.45))
                .andExpect(jsonPath("$.category").value("Shopping"));
    }
    @Test
    public void controller_shouldCreateExpenseWithLargeAmount() throws Exception {
        String expenseJson = "{\"name\":\"Flight\",\"amount\":99999.99,\"category\":\"Travel\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expenseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount").value(99999.99));
    }
    @Test
    public void controller_shouldAllowSpecialCharactersInName() throws Exception {
        String expenseJson = "{\"name\":\"Dinner @ Joe's!\",\"amount\":300.0,\"category\":\"Food\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(expenseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Dinner @ Joe's!"));
    }
    @Test
    public void exception_shouldRejectExpenseWithMissingFields() throws Exception {
        String incompleteJson = "{\"name\":\"Utilities\"}";
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(incompleteJson))
                .andExpect(status().isBadRequest());
    }
}
