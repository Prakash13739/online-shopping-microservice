package com.shopsphere.auth.service.impl;

import com.shopsphere.auth.dto.request.LoginRequest;
import com.shopsphere.auth.dto.request.RegisterRequest;
import com.shopsphere.auth.dto.response.AuthResponse;
import com.shopsphere.auth.dto.response.UserDto;
import com.shopsphere.auth.entity.Role;
import com.shopsphere.auth.entity.User;
import com.shopsphere.auth.exception.BadRequestException;
import com.shopsphere.auth.exception.ResourceNotFoundException;
import com.shopsphere.auth.repository.RoleRepository;
import com.shopsphere.auth.repository.UserRepository;
import com.shopsphere.auth.security.JwtUtil;
import com.shopsphere.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered: " + request.email());
        }

        String roleName = request.role() != null && request.role().equalsIgnoreCase("ROLE_ADMIN")
                ? "ROLE_ADMIN" : "ROLE_CUSTOMER";

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(null, roleName, "Default " + roleName)));

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setPhone(request.phone());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().getName(),
                savedUser.getPhone(),
                token
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Account is inactive or suspended");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone(),
                token
        );
    }

    @Override
    public UserDto getCurrentUser(User currentUser) {
        if (currentUser == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return new UserDto(
                currentUser.getId(),
                currentUser.getName(),
                currentUser.getEmail(),
                currentUser.getRole().getName(),
                currentUser.getPhone(),
                currentUser.getStatus()
        );
    }

    @Override
    public Map<String, Object> validateToken(String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean valid = jwtUtil.isTokenValid(token);
            if (valid) {
                String email = jwtUtil.extractEmail(token);
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    result.put("valid", true);
                    result.put("userId", user.getId());
                    result.put("email", user.getEmail());
                    result.put("name", user.getName());
                    result.put("role", user.getRole().getName());
                    return result;
                }
            }
        } catch (Exception ignored) {}
        result.put("valid", false);
        return result;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().getName(),
                        u.getPhone(),
                        u.getStatus()
                ))
                .collect(Collectors.toList());
    }
}
