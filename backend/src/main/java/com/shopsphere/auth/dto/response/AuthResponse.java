package com.shopsphere.auth.dto.response;

public record AuthResponse(
        String token,
        String type,
        Long id,
        String name,
        String email,
        String role,
        String phone
) {
    public AuthResponse(String token, Long id, String name, String email, String role, String phone) {
        this(token, "Bearer", id, name, email, role, phone);
    }
}
