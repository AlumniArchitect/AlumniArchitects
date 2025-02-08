package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.response.api.UserResponse;
import com.alumniarchitect.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/home")
    public String home() {
        return "Server Running";
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String email) {
        User user = userService.findByEmail(email);

        if(user == null) {
            return new ResponseEntity<>(new UserResponse(false, "User not found.", null), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new UserResponse(true, "User found", user), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser() {
        List<User> allUser = userService.findAll();

        if(allUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(allUser, HttpStatus.OK);
    }
}
