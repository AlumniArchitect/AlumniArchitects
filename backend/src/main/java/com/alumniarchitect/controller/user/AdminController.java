package com.alumniarchitect.controller.user;

import com.alumniarchitect.entity.Admin;
import com.alumniarchitect.entity.CollegeGroup;
import com.alumniarchitect.entity.UnverifiedUser;
import com.alumniarchitect.entity.User;
import com.alumniarchitect.service.admin.AdminService;
import com.alumniarchitect.service.cloudinary.CloudinaryService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.unverifiedUser.UnverifiedUserService;
import com.alumniarchitect.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserService userService;

    @Autowired
    private UnverifiedUserService unverifiedUserService;
    @Autowired
    private CollegeGroupService collegeGroupService;

    @PostMapping("/post-portal-img/{email}")
    public ResponseEntity<Boolean> postImg(@PathVariable String email, @RequestParam("file") MultipartFile file) throws IOException {
        Admin admin = adminService.findAdminByEmail(email);

        if (admin == null) {
            admin = new Admin();
            admin.setEmail(email);
        }

        String imgUrl = cloudinaryService.uploadImg(file);

        if (admin.getPortalImages() == null) {
            admin.setPortalImages(new ArrayList<>());
        }

        admin.getPortalImages().add(imgUrl);
        adminService.updateAdmin(admin);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @GetMapping("/get-portal-img/{email}")
    public ResponseEntity<List<String>> getImg(@PathVariable String email) {
        String collegeName = EmailService.extractCollegeName(email);
        Admin admin = adminService.findAdminByCollegeName(collegeName);

        if(admin == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(admin.getPortalImages(), HttpStatus.OK);
    }

    @GetMapping("/unverified-alumni/{adminEmail}")
    public List<String> getUnverifiedAlumni(@PathVariable String adminEmail) {
        return adminService.getUnverifiedAlumni(adminEmail);
    }

    @GetMapping("/{adminEmail}")
    public List<String> getModerators(@PathVariable String adminEmail) {
        return adminService.getModerators(adminEmail);
    }

    @GetMapping("/get-user-data/{email}")
    public ResponseEntity<List<User>> getUserData(@PathVariable String email) {
        if(adminService.findAdminByEmail(email) == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }

        String clgname = EmailService.extractCollegeName(email);
        CollegeGroup collegeGroups = collegeGroupService.findByCollegeName(clgname);
        List<User> users = new ArrayList<>();

        while (!collegeGroups.getEmails().isEmpty()) {
            users.add(userService.findByEmail(collegeGroups.getEmails().get(0)));
            collegeGroups.getEmails().remove(0);
        }

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/{adminEmail}")
    public ResponseEntity<Boolean> updateModerators(@PathVariable String adminEmail, @RequestBody List<String> moderators) {
        if(adminService.findAdminByEmail(adminEmail) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        adminService.updateModerators(adminEmail, moderators);

        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PostMapping("{adminEmail}/verified/{alumniEmail}")
    public ResponseEntity<Boolean> verified(@PathVariable String adminEmail, @PathVariable String alumniEmail) {
        Admin admin = adminService.findAdminByEmail(adminEmail);

        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        UnverifiedUser unverifiedUser = unverifiedUserService.findByEmail(alumniEmail);
        userService.saveUser(unverifiedUser.getUser());

        unverifiedUserService.deleteUnverifiedUser(unverifiedUser);
        admin.getUnverifiedAlumni().remove(alumniEmail);
        adminService.addAdmin(admin);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @DeleteMapping("/{adminEmail}/unverified-alumni/{userEmail}")
    public void removeFromUnverifiedList(@PathVariable String adminEmail, @PathVariable String userEmail) throws Exception {
        adminService.removeFromUnverifiedList(adminEmail, userEmail);
    }

    @PostMapping("/upload-verification-img/{email}")
    public ResponseEntity<Boolean> uploadVerificationImg(@PathVariable String email, @RequestParam("file") MultipartFile file) throws IOException {
        Admin admin = adminService.findAdminByCollegeName(EmailService.extractCollegeName(email));

        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String imgUrl = cloudinaryService.uploadImg(file);
        admin.getUnverifiedAlumni().put(email, imgUrl);
        adminService.addAdmin(admin);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }
}
