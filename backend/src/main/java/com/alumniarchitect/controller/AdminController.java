package com.alumniarchitect.controller;

import com.alumniarchitect.service.admin.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/{adminId}/unverified-alumni")
    public List<String> getUnverifiedAlumni(@PathVariable String adminId) {
        return adminService.getUnverifiedAlumni(adminId);
    }

    @GetMapping("/{adminId}/moderators")
    public List<String> getModerators(@PathVariable String adminId) {
        return adminService.getModerators(adminId);
    }

    @PutMapping("/{adminId}/moderators")
    public void updateModerators(@PathVariable String adminId, @RequestBody List<String> moderators) {
        adminService.updateModerators(adminId, moderators);
    }

    @DeleteMapping("/{adminId}/unverified-alumni/{userId}")
    public void removeFromUnverifiedList(@PathVariable String adminId, @PathVariable String userId) throws Exception {
        adminService.removeFromUnverifiedList(adminId, userId);
    }
}
