package com.shopsphere.payment.controller;

import com.shopsphere.payment.dto.request.PaymentRequest;
import com.shopsphere.payment.dto.response.ApiResponse;
import com.shopsphere.payment.dto.response.PaymentResponse;
import com.shopsphere.payment.entity.Payment;
import com.shopsphere.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    private PaymentResponse toDto(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getOrderId(),
                p.getUserId(),
                p.getAmount(),
                p.getPaymentMethod(),
                p.getTransactionId(),
                p.getStatus(),
                p.getErrorMessage(),
                p.getCreatedAt()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@RequestBody PaymentRequest request) {
        String method = (request.paymentMethod() != null && !request.paymentMethod().isBlank())
                ? request.paymentMethod().toUpperCase() : "CARD";

        String txnId = "TXN-" + System.currentTimeMillis() + "-" + method;

        Payment payment = new Payment();
        payment.setOrderId(request.orderId());
        payment.setUserId(request.userId() != null ? request.userId() : 2L);
        payment.setAmount(request.amount());
        payment.setPaymentMethod(method);
        payment.setTransactionId(txnId);

        // Simulation logic: if simulateFailure is true, simulate payment decline
        if (Boolean.TRUE.equals(request.simulateFailure())) {
            payment.setStatus("FAILED");
            payment.setErrorMessage("Payment simulation declined by issuing bank/network");
            Payment saved = paymentRepository.save(payment);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Payment failed: " + saved.getErrorMessage(), "PAYMENT_FAILED"));
        }

        payment.setStatus("SUCCESS");
        Payment saved = paymentRepository.save(payment);

        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", toDto(saved)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success("Payment found", toDto(p))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Payment record not found: " + id, "PAYMENT_NOT_FOUND")));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(p -> ResponseEntity.ok(ApiResponse.success("Payment found for order", toDto(p))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No payment found for order: " + orderId, "PAYMENT_NOT_FOUND")));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) Long userId) {
        List<Payment> payments = (userId != null)
                ? paymentRepository.findByUserId(userId)
                : paymentRepository.findAll();

        List<PaymentResponse> dtos = payments.stream().map(this::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", dtos));
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(@PathVariable Long id) {
        Optional<Payment> opt = paymentRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Payment not found", "PAYMENT_NOT_FOUND"));
        }
        Payment payment = opt.get();
        payment.setStatus("REFUNDED");
        payment.setErrorMessage("Refund processed to customer source account");
        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully", toDto(saved)));
    }
}
