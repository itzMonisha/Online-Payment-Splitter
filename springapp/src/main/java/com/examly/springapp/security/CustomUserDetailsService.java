package com.examly.springapp.security;

import java.util.ArrayList;
import java.util.Optional;

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

        Optional<com.examly.springapp.model.User> optionalUser =
                userRepository.findByEmail(email);

        if (!optionalUser.isPresent()) {

            throw new UsernameNotFoundException(
                    "User not found with email : " + email);

        }

        com.examly.springapp.model.User user =
                optionalUser.get();

        return new User(

                user.getEmail(),

                user.getPassword(),

                new ArrayList<>()

        );

    }

}