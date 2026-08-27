package com.shopsphere.payment.dto.request;

import java.math.BigDecimal;

public record PaymentRequest(
        Long orderId,
        Long userId,
        BigDecimal amount,
        String paymentMethod,
        Boolean simulateFailure
) {}
