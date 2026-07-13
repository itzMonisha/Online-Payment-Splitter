package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications of a user
    List<Notification> findByUserId(Long userId);

    // Get unread notifications
    List<Notification> findByIsReadFalse();

    // Get notifications by user and read status
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);

}