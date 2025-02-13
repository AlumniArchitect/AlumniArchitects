package com.alumniarchitect.service.resources;

import com.alumniarchitect.entity.Resource;
import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.repository.ResourceRepository;
import com.alumniarchitect.request.resource.ResourceRequest;
import com.alumniarchitect.service.cloudinary.CloudinaryService;
import com.alumniarchitect.service.userProfile.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource postResource(ResourceRequest resourceRequest, MultipartFile file) {
        try {
            String resourceUrl = cloudinaryService.uploadFile(file);
            UserProfile userProfile = userProfileService.findByEmail(resourceRequest.getEmail());

            Resource resource = new Resource();
            resource.setEmail(resourceRequest.getEmail());
            resource.setFullName(userProfile.getFullName());
            resource.setProfileImgUrl(userProfile.getProfileImageUrl());
            resource.setTitle(resourceRequest.getTitle());
            resource.setDescription(resourceRequest.getDescription());
            resource.setSem(resourceRequest.getSem());
            resource.setBranch(resourceRequest.getBranch());
            resource.setResourceUrl(resourceUrl);

            return resourceRepository.save(resource);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public List<Resource> getResourcesByBranch(String branch) {
        return resourceRepository.findByBranch(branch);
    }

    @Override
    public List<Resource> getResourcesBySem(String sem) {
        return resourceRepository.findBySem(sem);
    }

    @Override
    public List<Resource> getResourcesByEmail(String email) {
        return resourceRepository.findByEmail(email);
    }

    @Override
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
