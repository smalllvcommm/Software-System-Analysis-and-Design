package com.example.info.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // 标记为配置类
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许所有接口
                .allowedOrigins("http://localhost:5173") // 允许前端域名
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 允许所有请求方法
                .allowedHeaders("*") // 允许所有请求头
                .maxAge(3600); // 预检请求缓存时间（1小时，减少重复验证）
    }
}