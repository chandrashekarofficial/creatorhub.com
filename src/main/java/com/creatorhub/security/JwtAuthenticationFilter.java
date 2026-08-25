package com.creatorhub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println(
                "JWT FILTER -> " +
                request.getMethod() +
                " " +
                request.getRequestURI()
        );

        System.out.println(
                "AUTH HEADER PRESENT -> " +
                (header != null && header.startsWith("Bearer "))
        );

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                String email = jwtService.extractEmail(token);

                System.out.println(
                        "JWT EMAIL -> " + email
                );

                boolean valid =
                        jwtService.isValid(token, email);

                System.out.println(
                        "JWT VALID -> " + valid
                );

                if (
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null
                                && valid
                ) {

                    UserDetails details =
                            userDetailsService
                                    .loadUserByUsername(email);

                    var auth =
                            new UsernamePasswordAuthenticationToken(
                                    details,
                                    null,
                                    details.getAuthorities()
                            );

                    auth.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(auth);

                    System.out.println(
                            "AUTHENTICATION SET -> " +
                            auth.getName()
                    );

                } else {

                    System.out.println(
                            "AUTHENTICATION NOT SET"
                    );
                }

            } catch (Exception e) {

                System.out.println(
                        "JWT ERROR -> " +
                        e.getClass().getName() +
                        ": " +
                        e.getMessage()
                );
            }
        }

        System.out.println(
                "BEFORE CHAIN AUTH -> " +
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        chain.doFilter(request, response);
    }
}