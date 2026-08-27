package com.shopsphere.auth.service.impl;

import com.shopsphere.auth.dto.request.LoginRequest;
import com.shopsphere.auth.dto.request.RegisterRequest;
import com.shopsphere.auth.dto.response.AuthResponse;
import com.shopsphere.auth.dto.response.UserDto;
import com.shopsphere.auth.entity.Role;
import com.shopsphere.auth.entity.User;
import com.shopsphere.auth.repository.RoleRepository;
import com.shopsphere.auth.repository.UserRepository;
import com.shopsphere.auth.service.AuthService;
import com.shopsphere.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("Account is inactive or suspended");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone()
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User already exists with email: " + email);
        }

        String roleName = (request.role() != null && !request.role().isBlank())
                ? request.role()
                : "ROLE_CUSTOMER";

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(roleName);
                    newRole.setDescription("Default " + roleName);
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setPhone(request.phone());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser);
        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().getName(),
                savedUser.getPhone()
        );
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getPhone(),
                user.getStatus(),
                user.getCreatedAt()
        );
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
                        u.getStatus(),
                        u.getCreatedAt()
                ))
                .toList();
    }
}
