package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Notification;
import com.examly.springapp.service.NotificationService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:8081")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Create Notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @Valid @RequestBody Notification notification) {

        Notification savedNotification = notificationService.createNotification(notification);

        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }

    // Get All Notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications());

    }

    // Get Notification By Id
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(
            @PathVariable Long id) {

        Notification notification = notificationService.getNotificationById(id);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(notification);

    }

    // Get Notifications of User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getNotificationsByUserId(userId));

    }

    // Mark Notification Read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id) {

        Notification notification = notificationService.markAsRead(id);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(notification);

    }

    // Delete Notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id) {

        boolean deleted = notificationService.deleteNotification(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Notification not found");
        }

        return ResponseEntity.ok("Notification deleted successfully");
    }

}