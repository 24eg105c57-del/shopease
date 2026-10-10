package com.shopease.service;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest registerRequest);
}
