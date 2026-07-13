package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Settlement;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    /*
     * Get settlements where user is payer
     */
    List<Settlement> findByPayerId(Long payerId);

    /*
     * Get settlements where user is receiver
     */
    List<Settlement> findByReceiverId(Long receiverId);

    /*
     * Get settlements by status
     */
    List<Settlement> findByStatus(String status);

}