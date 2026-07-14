package com.examly.springapp.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

    // Secret Key
    private static final String SECRET_KEY = "examlyOnlinePaymentSplitterSecretKey";

    // Token Validity (24 Hours)
    private static final long JWT_VALIDITY = 24 * 60 * 60 * 1000;

    /*
     * Generate Token
     */
    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(
                "role",
                userDetails.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority());

        return createToken(
                claims,
                userDetails.getUsername());

    }

    /*
     * Create Token
     */
    private String createToken(Map<String, Object> claims,
            String subject) {

        return Jwts.builder()

                .setClaims(claims)

                .setSubject(subject)

                .setIssuedAt(new Date(System.currentTimeMillis()))

                .setExpiration(
                        new Date(System.currentTimeMillis()
                                + JWT_VALIDITY))

                .signWith(
                        SignatureAlgorithm.HS256,
                        SECRET_KEY)

                .compact();

    }

    /*
     * Extract Username
     */
    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);

    }

    /*
     * Extract Expiration Date
     */
    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);

    }

    /*
     * Extract Claims
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);

    }

    /*
     * Extract All Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .setSigningKey(SECRET_KEY)

                .parseClaimsJws(token)

                .getBody();

    }

    /*
     * Check Expired
     */
    private boolean isTokenExpired(String token) {

        return extractExpiration(token)

                .before(new Date());

    }

    /*
     * Validate Token
     */
    public boolean validateToken(
            String token,
            UserDetails userDetails) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);

    }

}