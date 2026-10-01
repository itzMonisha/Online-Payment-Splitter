package com.examly.springapp.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Settlement;
import com.examly.springapp.repository.SettlementRepository;

@Service
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;

    /*
     * Create Settlement
     */
    public Settlement createSettlement(Settlement settlement) {

        if (settlement.getSettlementDate() == null) {
            settlement.setSettlementDate(LocalDate.now());
        }

        if (settlement.getStatus() == null ||
                settlement.getStatus().isEmpty()) {

            settlement.setStatus("PENDING");
        }

        return settlementRepository.save(settlement);
    }

    /*
     * Get All Settlements
     */
    public List<Settlement> getAllSettlements() {

        return settlementRepository.findAll();

    }

    /*
     * Get Settlement By Id
     */
    public Settlement getSettlementById(Long id) {

        Optional<Settlement> optionalSettlement = settlementRepository.findById(id);

        if (optionalSettlement.isPresent()) {

            return optionalSettlement.get();

        }

        return null;

    }

    /*
     * Get Settlements By User Id
     */
    public List<Settlement> getSettlementsByUserId(Long userId) {

        List<Settlement> settlements = new ArrayList<>();

        settlements.addAll(settlementRepository.findByPayerId(userId));

        settlements.addAll(settlementRepository.findByReceiverId(userId));

        return settlements;

    }

    /*
     * Update Settlement
     */
    public Settlement updateSettlement(Long id,
            Settlement settlement) {

        Optional<Settlement> optionalSettlement = settlementRepository.findById(id);

        if (optionalSettlement.isPresent()) {

            Settlement existingSettlement = optionalSettlement.get();

            existingSettlement.setPayerId(
                    settlement.getPayerId());

            existingSettlement.setReceiverId(
                    settlement.getReceiverId());

            existingSettlement.setAmount(
                    settlement.getAmount());

            existingSettlement.setStatus(
                    settlement.getStatus());

            existingSettlement.setSettlementDate(
                    settlement.getSettlementDate());

            return settlementRepository.save(existingSettlement);

        }

        return null;

    }

    /*
     * Delete Settlement
     */
    public boolean deleteSettlement(Long id) {

        if (settlementRepository.existsById(id)) {

            settlementRepository.deleteById(id);

            return true;

        }

        return false;

    }

    /*
     * Get Settlements By Payer
     */
    public List<Settlement> getSettlementsByPayer(Long payerId) {

        return settlementRepository.findByPayerId(payerId);

    }

    /*
     * Get Settlements By Receiver
     */
    public List<Settlement> getSettlementsByReceiver(Long receiverId) {

        return settlementRepository.findByReceiverId(receiverId);

    }

    /*
     * Get Settlements By Status
     */
    public List<Settlement> getSettlementsByStatus(String status) {

        return settlementRepository.findByStatus(status);

    }

}