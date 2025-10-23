package com.example.info.service;

import com.example.info.dto.UpdatePasswordRequest;
import com.example.info.dto.UpdateProfileRequest;
import com.example.info.entity.User;
import com.example.info.exception.BusinessException;
import com.example.info.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 根据用户名查找用户
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }
    
    /**
     * 更新用户资料
     */
    @Transactional
    public User updateProfile(String username, UpdateProfileRequest request) {
        User user = findByUsername(username);
        
        // 如果要更新邮箱，检查邮箱是否已被使用
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (!request.getEmail().equals(user.getEmail()) 
                && userRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("邮箱已被使用");
            }
            user.setEmail(request.getEmail());
        }
        
        // 更新用户名（如果提供）
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            if (!request.getUsername().equals(user.getUsername()) 
                && userRepository.existsByUsername(request.getUsername())) {
                throw new BusinessException("用户名已存在");
            }
            user.setUsername(request.getUsername());
        }
        
        return userRepository.save(user);
    }
    
    /**
     * 修改密码
     */
    @Transactional
    public void updatePassword(String username, UpdatePasswordRequest request) {
        User user = findByUsername(username);
        
        // 验证当前密码
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("当前密码不正确");
        }
        
        // 更新密码
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

