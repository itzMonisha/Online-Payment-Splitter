package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Settlement;
import com.examly.springapp.service.SettlementService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/settlements")
@CrossOrigin(origins = "http://localhost:8081")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    /*
     * -----------------------------------------
     * Create Settlement
     * POST : /api/settlements
     * -----------------------------------------
     */

    @PostMapping
    public ResponseEntity<Settlement> createSettlement(
            @Valid @RequestBody Settlement settlement) {

        Settlement savedSettlement = settlementService.createSettlement(settlement);

        return new ResponseEntity<>(savedSettlement, HttpStatus.CREATED);
    }

    /*
     * -----------------------------------------
     * Get All Settlements
     * GET : /api/settlements
     * -----------------------------------------
     */

    @GetMapping
    public ResponseEntity<List<Settlement>> getAllSettlements() {

        return ResponseEntity.ok(
                settlementService.getAllSettlements());

    }

    /*
     * -----------------------------------------
     * Get Settlement By Id
     * GET : /api/settlements/{id}
     * -----------------------------------------
     */

    @GetMapping("/{id}")
    public ResponseEntity<Settlement> getSettlementById(
            @PathVariable Long id) {

        Settlement settlement = settlementService.getSettlementById(id);

        if (settlement == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(settlement);

    }

    /*
     * -----------------------------------------
     * Get Settlements By User
     * GET : /api/settlements/user/{userId}
     * -----------------------------------------
     */

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Settlement>> getSettlementsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                settlementService.getSettlementsByUserId(userId));

    }

    /*
     * -----------------------------------------
     * Update Settlement
     * PUT : /api/settlements/{id}
     * -----------------------------------------
     */

    @PutMapping("/{id}")
    public ResponseEntity<Settlement> updateSettlement(
            @PathVariable Long id,
            @Valid @RequestBody Settlement settlement) {

        Settlement updatedSettlement = settlementService.updateSettlement(id, settlement);

        if (updatedSettlement == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedSettlement);

    }

    /*
     * -----------------------------------------
     * Delete Settlement
     * DELETE : /api/settlements/{id}
     * -----------------------------------------
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSettlement(
            @PathVariable Long id) {

        boolean deleted = settlementService.deleteSettlement(id);

        if (!deleted) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Settlement not found");

        }

        return ResponseEntity.ok(
                "Settlement deleted successfully");

    }

}