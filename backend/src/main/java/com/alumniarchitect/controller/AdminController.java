package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Admin;
import com.alumniarchitect.service.admin.AdminService;
import com.alumniarchitect.service.cloudinary.CloudinaryService;
import com.alumniarchitect.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<Boolean> addAdmin(@RequestBody Admin admin) {
        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (EmailService.isValidCollegeEmail(admin.getEmail()) && Character.isDigit(admin.getEmail().charAt(0))) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }

        admin.setCollegeName(EmailService.extractCollegeName(admin.getEmail()));
        adminService.addAdmin(admin);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @PostMapping("/{email}/post-portal-img")
    public ResponseEntity<Boolean> postImg(@PathVariable String email, @RequestParam("file") MultipartFile file) throws IOException {
        Admin admin = adminService.findAdminByEmail(email);

        if (admin == null) {
            admin = new Admin();
            admin.setEmail(email);
        }

        String imgUrl = cloudinaryService.uploadImg(file);
        admin.getPortalImages().add(imgUrl);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @GetMapping("{email}/get-portal-img")
    public ResponseEntity<List<String>> getImg(@PathVariable String email) {
        String collegeName = EmailService.extractCollegeName(email);
        Admin admin = adminService.findAdminByCollegeName(collegeName);

        if(admin == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(admin.getPortalImages(), HttpStatus.OK);
    }

    @GetMapping("/{adminEmail}/unverified-alumni")
    public List<String> getUnverifiedAlumni(@PathVariable String adminEmail) {
        return adminService.getUnverifiedAlumni(adminEmail);
    }

    @GetMapping("/{adminEmail}/moderators")
    public List<String> getModerators(@PathVariable String adminEmail) {
        return adminService.getModerators(adminEmail);
    }

    @PutMapping("/{adminEmail}/moderators")
    public void updateModerators(@PathVariable String adminEmail, @RequestBody List<String> moderators) {
        adminService.updateModerators(adminEmail, moderators);
    }

    @DeleteMapping("/{adminEmail}/unverified-alumni/{userEmail}")
    public void removeFromUnverifiedList(@PathVariable String adminEmail, @PathVariable String userEmail) throws Exception {
        adminService.removeFromUnverifiedList(adminEmail, userEmail);
    }
}
