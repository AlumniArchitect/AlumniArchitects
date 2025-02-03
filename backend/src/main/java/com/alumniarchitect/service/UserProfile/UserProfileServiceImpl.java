package com.alumniarchitect.service.UserProfile;

import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Override
    public UserProfile findByEmail(String email) {
        return userProfileRepository.findByEmail(email);
    }

    @Override
    public UserProfile saveUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile createOrUpdateUserProfile(UserProfile userProfile) {
        String email = userProfile.getEmail();
        UserProfile existingProfile = userProfileRepository.findByEmail(email);

        if (existingProfile == null) {
            existingProfile = new UserProfile();
            existingProfile.setEmail(email);
        }

        if (StringUtils.hasText(userProfile.getProfileImageUrl())) {
            existingProfile.setProfileImageUrl(userProfile.getProfileImageUrl());
        }
        if (StringUtils.hasText(userProfile.getResumeUrl())) {
            existingProfile.setResumeUrl(userProfile.getResumeUrl());
        }
        if (StringUtils.hasText(userProfile.getBio())) {
            existingProfile.setBio(userProfile.getBio());
        }
        if (userProfile.getSocialLinks() != null && !userProfile.getSocialLinks().isEmpty()) {
            existingProfile.setSocialLinks(userProfile.getSocialLinks());
        }
        if (userProfile.getSkills() != null && !userProfile.getSkills().isEmpty()) {
            existingProfile.setSkills(userProfile.getSkills());
        }
        if (StringUtils.hasText(userProfile.getLocation())) {
            existingProfile.setLocation(userProfile.getLocation());
        }

        return userProfileRepository.save(existingProfile);
    }
}
