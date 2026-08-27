package com.shopsphere.auth.dto.response;

public record UserDto(
        Long id,
        String name,
        String email,
        String role,
        String phone,
        String status
) {}
