package com.examly.springapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /*
     * Register New User
     */
    public User registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default Role
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    /*
     * Find User By Email
     */
    public User findByEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        }

        return null;
    }

    /*
     * Save User
     */
    public User saveUser(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);

    }

    /*
     * Check Email Exists
     */
    public boolean emailExists(String email) {

        return userRepository.existsByEmail(email);

    }

}