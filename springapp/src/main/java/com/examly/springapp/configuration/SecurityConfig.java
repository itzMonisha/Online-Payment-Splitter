// package com.examly.springapp.configuration;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;

// import org.springframework.security.config.http.SessionCreationPolicy;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration
// public class SecurityConfig {

//     private final JwtAuthenticationFilter jwtAuthenticationFilter;

//     public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
//         this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(
//             AuthenticationConfiguration configuration)
//             throws Exception {

//         return configuration.getAuthenticationManager();
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http)
//             throws Exception {

//         http
//                 .csrf().disable()

//                 .cors(Customizer.withDefaults())

//                 .sessionManagement()

//                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

//                 .and()

//                 .authorizeRequests()

//                 .antMatchers(
//                         "/api/auth/**",
//                         "/swagger-ui/**",
//                         "/swagger-ui.html",
//                         "/v3/api-docs/**",
//                         "/swagger-resources/**",
//                         "/webjars/**")

//                 .permitAll()

//                 .anyRequest()

//                 .authenticated()

//                 .and()

//                 .addFilterBefore(
//                         jwtAuthenticationFilter,
//                         UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

// }

package com.examly.springapp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();

    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

                .csrf().disable()

                .authorizeRequests()

                .anyRequest().permitAll();

        return http.build();

    }

}