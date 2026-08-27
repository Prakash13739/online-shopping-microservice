package com.shopsphere.auth.service;

import com.shopsphere.auth.dto.request.LoginRequest;
import com.shopsphere.auth.dto.request.RegisterRequest;
import com.shopsphere.auth.dto.response.AuthResponse;
import com.shopsphere.auth.dto.response.UserDto;
import com.shopsphere.auth.entity.User;

import java.util.List;
import java.util.Map;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser(User currentUser);
    Map<String, Object> validateToken(String token);
    List<UserDto> getAllUsers();
}
