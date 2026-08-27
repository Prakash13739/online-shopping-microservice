package com.shopsphere.auth.service;

import com.shopsphere.auth.dto.request.LoginRequest;
import com.shopsphere.auth.dto.request.RegisterRequest;
import com.shopsphere.auth.dto.response.AuthResponse;
import com.shopsphere.auth.dto.response.UserDto;

import java.util.List;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    UserDto getCurrentUser(String email);
    List<UserDto> getAllUsers();
}
