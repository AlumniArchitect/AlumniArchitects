package com.alumniarchitect.controller.auth;

import com.alumniarchitect.entity.user.User;
import com.alumniarchitect.response.AuthResponse;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.user.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup() throws MessagingException {



        return null;
    }
}
