package com.shopsphere.auth.controller;

import com.shopsphere.auth.dto.request.LoginRequest;
import com.shopsphere.auth.dto.request.RegisterRequest;
import com.shopsphere.auth.dto.response.ApiResponse;
import com.shopsphere.auth.dto.response.AuthResponse;
import com.shopsphere.auth.dto.response.UserDto;
import com.shopsphere.auth.entity.User;
import com.shopsphere.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDto userDto = authService.getCurrentUser(user);
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", userDto));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> validation = authService.validateToken(token);
        return ResponseEntity.ok(ApiResponse.success("Token validation complete", validation));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", users));
    }
}
