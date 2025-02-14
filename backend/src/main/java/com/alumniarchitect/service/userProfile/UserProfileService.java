package com.alumniarchitect.service.userProfile;

import com.alumniarchitect.entity.UserProfile;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfileService {

    UserProfile findByEmail(String email);

    UserProfile createOrUpdateUserProfile(UserProfile userProfile);

    String uploadImage(MultipartFile file);

    void delete(String email);
}
