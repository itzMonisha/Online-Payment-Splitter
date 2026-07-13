package com.examly.springapp.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.JwtResponse;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.security.JwtService;
import com.examly.springapp.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    /*
     * Register User
     */

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @Valid @RequestBody RegisterRequest request) {

        User savedUser = authService.registerUser(request);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    /*
     * Login
     */

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(
            @Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),
                        request.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        JwtResponse response = new JwtResponse(
                token,
                userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    /*
     * Validate Token
     */

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {

        return ResponseEntity.ok("JWT Token is valid");

    }

    /*
     * Logout
     */

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {

        return ResponseEntity.ok("Logged out successfully");

    }

}