package com.shopsphere.notification.dto.request;

public record CreateNotificationRequest(
        Long userId,
        Long orderId,
        String type,
        String title,
        String message
) {}
