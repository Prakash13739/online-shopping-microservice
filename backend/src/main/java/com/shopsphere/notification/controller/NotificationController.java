package com.shopsphere.notification.controller;

import com.shopsphere.common.dto.ApiResponse;
import com.shopsphere.notification.dto.request.CreateNotificationRequest;
import com.shopsphere.notification.entity.Notification;
import com.shopsphere.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    private Long resolveUserId(String headerUserId, Long paramUserId) {
        if (paramUserId != null) return paramUserId;
        if (headerUserId != null && !headerUserId.isBlank()) {
            try { return Long.parseLong(headerUserId); } catch (Exception ignored) {}
        }
        return 2L;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId) {

        Long uid = resolveUserId(headerUserId, userId);
        List<Notification> notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(uid);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notifs));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUnreadCount(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId) {

        Long uid = resolveUserId(headerUserId, userId);
        long count = notificationRepository.countByUserIdAndIsReadFalse(uid);
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(@RequestBody CreateNotificationRequest request) {
        Notification notif = new Notification();
        notif.setUserId(request.userId() != null ? request.userId() : 2L);
        notif.setOrderId(request.orderId());
        notif.setType(request.type() != null ? request.type() : "INFO");
        notif.setTitle(request.title());
        notif.setMessage(request.message());
        notif.setIsRead(false);

        Notification saved = notificationRepository.save(notif);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Notification created", saved));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable Long id) {
        Optional<Notification> opt = notificationRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Notification not found", "NOT_FOUND"));
        }
        Notification n = opt.get();
        n.setIsRead(true);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", notificationRepository.save(n)));
    }

    @PutMapping("/read-all")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long userId) {

        Long uid = resolveUserId(headerUserId, userId);
        notificationRepository.markAllAsReadByUserId(uid);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
