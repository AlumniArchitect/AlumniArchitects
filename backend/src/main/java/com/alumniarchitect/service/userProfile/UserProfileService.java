package com.alumniarchitect.service.userProfile;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.entity.UserProfile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface UserProfileService {

    UserProfile findByEmail(String email);

    UserProfile saveUserProfile(UserProfile userProfile);

    UserProfile createOrUpdateUserProfile(UserProfile userProfile);

    Map uploadImage(MultipartFile file);

    void delete(User user);
}
