package com.alumniarchitect.service.UserProfile;

import com.alumniarchitect.entity.UserProfile;

public interface UserProfileService {

    UserProfile findByEmail(String email);
    UserProfile saveUserProfile(UserProfile userProfile);
    UserProfile createOrUpdateUserProfile(UserProfile userProfile);
}
