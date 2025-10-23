package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.dto.AuthResponse;
import com.example.info.dto.LoginRequest;
import com.example.info.dto.RegisterRequest;
import com.example.info.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseResult<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseResult.success(response);
    }
    
    @PostMapping("/login")
    public ResponseResult<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseResult.success(response);
    }
}

