package com.shopease.controller;

import com.shopease.dto.ApiResponse;
import com.shopease.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        HealthResponse health = new HealthResponse(
                "UP",
                "ShopEase E-Commerce API",
                "1.0.0"
        );
        return ResponseEntity.ok(ApiResponse.success("Service is healthy and reachable", health));
    }
}
