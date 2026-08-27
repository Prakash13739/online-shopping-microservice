package com.shopsphere.auth.dto.response;

public record AuthResponse(
        Long id,
        String name,
        String email,
        String role,
        String phone,
        String token
) {}
