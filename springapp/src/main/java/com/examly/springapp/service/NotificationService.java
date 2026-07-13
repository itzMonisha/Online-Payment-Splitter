package com.examly.springapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Notification;
import com.examly.springapp.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /*
     * Create Notification
     */
    public Notification createNotification(Notification notification) {

        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }

        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    /*
     * Get All Notifications
     */
    public List<Notification> getAllNotifications() {

        return notificationRepository.findAll();

    }

    /*
     * Get Notification By Id
     */
    public Notification getNotificationById(Long id) {

        Optional<Notification> optionalNotification = notificationRepository.findById(id);

        if (optionalNotification.isPresent()) {
            return optionalNotification.get();
        }

        return null;
    }

    /*
     * Get Notifications By User
     */
    public List<Notification> getNotificationsByUserId(Long userId) {

        return notificationRepository.findByUserId(userId);

    }

    /*
     * Mark Notification As Read
     */
    public Notification markAsRead(Long id) {

        Optional<Notification> optionalNotification = notificationRepository.findById(id);

        if (optionalNotification.isPresent()) {

            Notification notification = optionalNotification.get();

            notification.setRead(true);

            return notificationRepository.save(notification);
        }

        return null;
    }

    /*
     * Delete Notification
     */
    public boolean deleteNotification(Long id) {

        if (notificationRepository.existsById(id)) {

            notificationRepository.deleteById(id);

            return true;

        }

        return false;
    }

    /*
     * Get Unread Notifications
     */
    public List<Notification> getUnreadNotifications() {

        return notificationRepository.findByIsReadFalse();

    }

    /*
     * Get User Read Notifications
     */
    public List<Notification> getUserReadNotifications(Long userId) {

        return notificationRepository.findByUserIdAndIsRead(userId, true);

    }

    /*
     * Get User Unread Notifications
     */
    public List<Notification> getUserUnreadNotifications(Long userId) {

        return notificationRepository.findByUserIdAndIsRead(userId, false);

    }

}