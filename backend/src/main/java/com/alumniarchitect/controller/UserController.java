package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @GetMapping("api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findByJWT(jwt);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
