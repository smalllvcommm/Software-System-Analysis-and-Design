package com.example.info.service;

import com.example.info.dto.AuthResponse;
import com.example.info.dto.LoginRequest;
import com.example.info.dto.RegisterRequest;
import com.example.info.entity.User;
import com.example.info.exception.BusinessException;
import com.example.info.repository.UserRepository;
import com.example.info.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 檢查用戶名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("用戶名已存在");
        }
        
        // 檢查郵箱是否已存在
        if (request.getEmail() != null && !request.getEmail().isEmpty() 
            && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("郵箱已被使用");
        }
        
        // 創建新用戶
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole("USER"); // 默認角色為普通用戶
        
        userRepository.save(user);
        
        // 生成 Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        
        return new AuthResponse(token, user.getUsername(), user.getRole(), "註冊成功");
    }
    
    public AuthResponse login(LoginRequest request) {
        // 查找用戶
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("用戶名或密碼錯誤"));
        
        // 驗證密碼
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("用戶名或密碼錯誤");
        }
        
        // 生成 Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        
        return new AuthResponse(token, user.getUsername(), user.getRole(), "登錄成功");
    }
}

