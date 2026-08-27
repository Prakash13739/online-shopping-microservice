package com.shopsphere.payment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long orderId,
        Long userId,
        BigDecimal amount,
        String paymentMethod,
        String transactionId,
        String status,
        String errorMessage,
        LocalDateTime createdAt
) {}
