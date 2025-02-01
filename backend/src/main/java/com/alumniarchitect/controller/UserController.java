package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("api/user")
    public ResponseEntity<User> getUserProfile(@RequestBody String email) throws Exception {
        User user = userService.findByEmail(email);

        if(user == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
