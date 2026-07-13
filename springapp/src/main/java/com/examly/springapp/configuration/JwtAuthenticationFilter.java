// package com.examly.springapp.configuration;

// import java.io.IOException;

// import org.springframework.beans.factory.annotation.Autowired;

// import org.springframework.stereotype.Component;

// import org.springframework.web.filter.OncePerRequestFilter;

// import com.examly.springapp.security.JwtService;

// import javax.servlet.FilterChain;

// import javax.servlet.ServletException;

// import javax.servlet.http.HttpServletRequest;

// import javax.servlet.http.HttpServletResponse;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

// import com.examly.springapp.security.CustomUserDetailsService;

// @Component
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//         @Autowired
//         private JwtService jwtService;

//         @Autowired
//         private CustomUserDetailsService userDetailsService;

//         @Override
//         protected void doFilterInternal(

//                         HttpServletRequest request,

//                         HttpServletResponse response,

//                         FilterChain filterChain)

//                         throws ServletException, IOException {

//                 String authHeader = request.getHeader("Authorization");

//                 String token = null;

//                 String username = null;
//                 String jwt = null;

//                 if (authHeader != null && authHeader.startsWith("Bearer ")) {

//                         token = authHeader.substring(7);

//                         username = jwtService.extractUsername(token);

//                 }

//                 if (username != null

//                                 && SecurityContextHolder.getContext().getAuthentication() == null) {

//                         UserDetails userDetails

//                                         = userDetailsService.loadUserByUsername(username);

//                         if (jwtService.validateToken(jwt, userDetails)) {

//                                 UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                                                 userDetails,
//                                                 null,
//                                                 userDetails.getAuthorities());

//                                 authenticationToken.setDetails(
//                                                 new WebAuthenticationDetailsSource()
//                                                                 .buildDetails(request));

//                                 SecurityContextHolder.getContext()
//                                                 .setAuthentication(authenticationToken);
//                         }

//                 }

//                 filterChain.doFilter(request, response);

//         }

// }
package com.examly.springapp.configuration;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import com.examly.springapp.security.CustomUserDetailsService;
import com.examly.springapp.security.JwtService;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        @Autowired
        private JwtService jwtService;

        @Autowired
        private CustomUserDetailsService userDetailsService;

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");

                String token = null;
                String username = null;

                if (authHeader != null && authHeader.startsWith("Bearer ")) {

                        token = authHeader.substring(7);

                        username = jwtService.extractUsername(token);

                }

                if (username != null &&
                                SecurityContextHolder.getContext().getAuthentication() == null) {

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        if (jwtService.validateToken(token, userDetails)) {

                                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                                userDetails,
                                                null,
                                                userDetails.getAuthorities());

                                authenticationToken.setDetails(
                                                new WebAuthenticationDetailsSource()
                                                                .buildDetails(request));

                                SecurityContextHolder.getContext()
                                                .setAuthentication(authenticationToken);
                        }
                }

                filterChain.doFilter(request, response);

        }

}