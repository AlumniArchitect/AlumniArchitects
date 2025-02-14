package com.alumniarchitect.controller;

import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.response.api.UserProfileResponse;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.service.user.UserService;
import com.alumniarchitect.service.userProfile.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private SkillsService skillsService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileResponse> saveProfile(@RequestBody UserProfile userProfile) {
        if (userService.findByEmail(userProfile.getEmail()) == null) {
            return new ResponseEntity<>(new UserProfileResponse(false, "User not found", null), HttpStatus.NOT_FOUND);
        }

        UserProfile updatedProfile = userProfileService.createOrUpdateUserProfile(userProfile);

        try {
            if(userProfile.getSkills() != null && !userProfile.getSkills().isEmpty()) {
                skillsService.addEmailToSkill(userProfile.getSkills(), updatedProfile.getEmail());
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new UserProfileResponse(false, "Error mapping skills asn email: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(new UserProfileResponse(true, "Profile Updated.", updatedProfile),
                HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String email) {
        UserProfile userProfile = userProfileService.findByEmail(email);

        if (userProfile == null) {
            return new ResponseEntity<>(new UserProfileResponse(false, "User not found", null),
                    HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new UserProfileResponse(true, "Profile Found.", userProfile), HttpStatus.OK);
    }

    @PostMapping("/uploadProfileImage/{email}")
    public ResponseEntity<String> uploadProfileImage(@PathVariable String email, @RequestParam("image") MultipartFile file) {
        UserProfile userProfile = userProfileService.findByEmail(email);

        if (userProfile == null) {
            userProfile = new UserProfile();
            userProfile.setEmail(email);
        }

        String img = userProfileService.uploadImage(file);
        userProfile.setProfileImageUrl(img);
        userProfileService.createOrUpdateUserProfile(userProfile);

        return new ResponseEntity<>(img, HttpStatus.OK);
    }

    @GetMapping("/getProfileImage/{email}")
    public ResponseEntity<String> getProfileImage(@PathVariable String email) {
        if(userProfileService.findByEmail(email) == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UserProfile userProfile = userProfileService.findByEmail(email);
        return new ResponseEntity<>(userProfile.getProfileImageUrl(), HttpStatus.OK);
    }

    @GetMapping("/is-profile-complete/{email}")
    public ResponseEntity<Boolean> isProfileComplete(@PathVariable String email) {
        if(userProfileService.findByEmail(email) == null) {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }

        UserProfile userProfile = userProfileService.findByEmail(email);

        return new ResponseEntity<>(userProfile.isComplete(), HttpStatus.OK);
    }
}
