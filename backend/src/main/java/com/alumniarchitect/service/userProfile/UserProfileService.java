package com.alumniarchitect.service.userProfile;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.entity.UserProfile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface UserProfileService {

    UserProfile findByEmail(String email);

    UserProfile createOrUpdateUserProfile(UserProfile userProfile);

    Map uploadImage(MultipartFile file);

    void delete(String email);
}
