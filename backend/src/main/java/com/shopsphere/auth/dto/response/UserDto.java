package com.shopsphere.auth.dto.response;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String name,
        String email,
        String role,
        String phone,
        String status,
        LocalDateTime createdAt
) {}
