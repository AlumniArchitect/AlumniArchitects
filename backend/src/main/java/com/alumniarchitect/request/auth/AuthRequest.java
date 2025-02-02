package com.alumniarchitect.request.auth;

import lombok.Data;

@Data
public class AuthRequest {

    private String email;
    private String password;
}
