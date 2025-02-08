package com.alumniarchitect.service.UserProfile;

import com.alumniarchitect.entity.UserProfile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface UserProfileService {

    UserProfile findByEmail(String email);

    UserProfile saveUserProfile(UserProfile userProfile);

    UserProfile createOrUpdateUserProfile(UserProfile userProfile);

    Map uploadImage(MultipartFile file);
}
