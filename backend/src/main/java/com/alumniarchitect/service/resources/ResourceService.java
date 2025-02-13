package com.alumniarchitect.service.resources;

import com.alumniarchitect.entity.Resource;
import com.alumniarchitect.request.resource.ResourceRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface ResourceService {
    List<Resource> getAllResources();
    Resource postResource(ResourceRequest resourceRequest, MultipartFile file);
    List<Resource> getResourcesByBranch(String branch);
    List<Resource> getResourcesBySem(String sem);
    List<Resource> getResourcesByEmail(String email);
    void deleteResource(String id);
}
