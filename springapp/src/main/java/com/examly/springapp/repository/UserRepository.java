package com.examly.springapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /*
     * Find User By Email
     */
    Optional<User> findByEmail(String email);

    /*
     * Check Email Exists
     */
    boolean existsByEmail(String email);

    /*
     * Search Users By Name
     */
    List<User> findByNameContainingIgnoreCase(String keyword);

    /*
     * Find Users By Role
     */
    List<User> findByRole(String role);

    /*
     * Find User By Phone Number
     */
    Optional<User> findByPhone(String phone);

}