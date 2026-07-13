package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /*
     * Create User
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /*
     * Get All Users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /*
     * Get User By Id
     */
    public User getUserById(Long id) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        }

        return null;
    }

    /*
     * Get User By Email
     */
    public User getUserByEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        }

        return null;
    }

    /*
     * Update User
     */
    public User updateUser(Long id, User user) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {

            User existingUser = optionalUser.get();

            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());

            return userRepository.save(existingUser);
        }

        return null;
    }

    /*
     * Delete User
     */
    public boolean deleteUser(Long id) {

        if (userRepository.existsById(id)) {

            userRepository.deleteById(id);

            return true;
        }

        return false;
    }

    /*
     * Search Users
     */
    public List<User> searchUsers(String keyword) {

        return userRepository.findByNameContainingIgnoreCase(keyword);

    }

}