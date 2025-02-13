package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Resource;
import com.alumniarchitect.request.resource.ResourceRequest;
import com.alumniarchitect.service.resources.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping()
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @PostMapping()
    public ResponseEntity<Resource> postResource(
            @RequestParam String email,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String sem,
            @RequestParam String branch,
            @RequestParam("file") MultipartFile file
    ) {
        ResourceRequest resourceRequest = new ResourceRequest(email, title, description, sem, branch);

        Resource savedResource = resourceService.postResource(resourceRequest, file);
        return ResponseEntity.ok(savedResource);
    }

    @GetMapping("/by-branch")
    public ResponseEntity<List<Resource>> getResourcesByBranch(@RequestParam("branch") String branch) {
        List<Resource> resources = resourceService.getResourcesByBranch(branch);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/by-sem")
    public ResponseEntity<List<Resource>> getResourcesBySem(@RequestParam("sem") String sem) {
        List<Resource> resources = resourceService.getResourcesBySem(sem);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/by-email")
    public ResponseEntity<List<Resource>> getResourcesByEmail(@RequestParam("email") String email) {
        List<Resource> resources = resourceService.getResourcesByEmail(email);
        return ResponseEntity.ok(resources);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);

        return ResponseEntity.ok(true);
    }
}