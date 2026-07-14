package com.examly.springapp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.examly.springapp.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                com.examly.springapp.model.User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with email : " + email));

                return User.builder()
                                .username(user.getEmail())
                                .password(user.getPassword())
                                .authorities(user.getRole().name())
                                .build();
        }
}