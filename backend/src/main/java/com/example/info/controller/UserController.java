package com.example.info.controller;

import com.example.info.common.ResponseResult;
import com.example.info.dto.UpdatePasswordRequest;
import com.example.info.dto.UpdateProfileRequest;
import com.example.info.entity.User;
import com.example.info.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ResponseResult<User> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        // 清除密码字段，不返回给前端
        user.setPassword(null);
        return ResponseResult.success(user);
    }

    /**
     * 更新个人资料
     */
    @PutMapping("/profile")
    public ResponseResult<User> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User user = userService.updateProfile(username, request);
        user.setPassword(null);
        return ResponseResult.success(user, "个人资料更新成功");
    }

    /**
     * 修改密码
     */
    @PutMapping("/password")
    public ResponseResult<Void> updatePassword(
            @RequestBody UpdatePasswordRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        userService.updatePassword(username, request);
        return ResponseResult.success(null, "密码修改成功");
    }
}

