package com.alumniarchitect.controller;

import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.response.api.UserProfileResponse;
import com.alumniarchitect.service.User.UserService;
import com.alumniarchitect.service.UserProfile.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileResponse> saveProfile(@RequestBody UserProfile userProfile) {
        if (userService.findByEmail(userProfile.getEmail()) == null) {
            return new ResponseEntity<>(new UserProfileResponse(false, "User not found", null), HttpStatus.NOT_FOUND);
        }

        UserProfile updatedProfile = userProfileService.createOrUpdateUserProfile(userProfile);

        return new ResponseEntity<>(new UserProfileResponse(true, "Profile Updated.", updatedProfile), HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String email) {
        UserProfile userProfile = userProfileService.findByEmail(email);

        if (userProfile == null) {
            return new ResponseEntity<>(new UserProfileResponse(false, "User not found", null), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new UserProfileResponse(true, "Profile Found.", userProfile), HttpStatus.OK);
    }

//    @PostMapping("/uploadProfileImage/{email}")
//    public ResponseEntity<UserProfileResponse> uploadProfileImage(@PathVariable String email, @RequestBody MultipartFile file) {
//
//    }
//
//    @GetMapping("/getProfileImage/{email}")
//    public ResponseEntity<UserProfileResponse> uploadProfileImage(@PathVariable String email) {
//
//    }
}
