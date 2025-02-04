package com.alumniarchitect.service.UserProfile;

import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.repository.UserProfileRepository;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private Cloudinary cloudinary;

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
        if (StringUtils.hasText(userProfile.getMobileNumber())) {
            existingProfile.setMobileNumber(userProfile.getMobileNumber());
        }
        if (userProfile.getEducation() != null && !userProfile.getEducation().isEmpty()) {
            existingProfile.setEducation(userProfile.getEducation());
        }

        existingProfile.setComplete(isProfileComplete(existingProfile));
        return userProfileRepository.save(existingProfile);
    }

    private boolean isProfileComplete(UserProfile userProfile) {
        return StringUtils.hasText(userProfile.getEmail()) &&
                StringUtils.hasText(userProfile.getProfileImageUrl()) &&
                StringUtils.hasText(userProfile.getResumeUrl()) &&
                StringUtils.hasText(userProfile.getBio()) &&
                userProfile.getSocialLinks() != null && !userProfile.getSocialLinks().isEmpty() &&
                userProfile.getSkills() != null && !userProfile.getSkills().isEmpty() &&
                StringUtils.hasText(userProfile.getLocation()) &&
                StringUtils.hasText(userProfile.getMobileNumber()) &&
                userProfile.getEducation() != null && !userProfile.getEducation().isEmpty();
    }

    @Override
    public Map uploadImage(MultipartFile file) {
        try {
            return this.cloudinary.uploader().upload(file.getBytes(), Map.of());
        } catch (Exception e) {
            throw new RuntimeException("Image uploading failed. Error : " + e.getMessage());
        }
    }
}