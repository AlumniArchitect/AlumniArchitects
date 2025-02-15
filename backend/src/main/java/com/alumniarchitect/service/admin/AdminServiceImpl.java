package com.alumniarchitect.service.admin;

import com.alumniarchitect.entity.Admin;
import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.AdminRepository;
import com.alumniarchitect.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserService userService;

    @Override
    public void addAdmin(Admin admin) {
        adminRepository.save(admin);
    }

    @Override
    public Admin findAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public List<String> getUnverifiedAlumni(String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);

        return admin != null ? new ArrayList<>(admin.getUnverifiedAlumni().keySet()) : null;
    }

    @Override
    public List<String> getModerators(String adminEmail) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        return admin != null ? admin.getModerators() : null;
    }

    @Override
    public void updateModerators(String adminEmail, List<String> moderators) {
        Admin admin = adminRepository.findByEmail(adminEmail);
        if (admin != null) {
            admin.setModerators(moderators);
            adminRepository.save(admin);
        }
    }

    @Override
    public void removeFromUnverifiedList(String adminEmail, String userEmail) throws Exception {
        Admin admin = adminRepository.findByEmail(adminEmail);

        if (admin != null && admin.getUnverifiedAlumni().containsKey(userEmail)) {
            User user = userService.findByEmail(userEmail);
            user.setVerified(true);
            userService.saveUser(user);

            admin.getUnverifiedAlumni().remove(userEmail);
            adminRepository.save(admin);
        } else {
            throw new Exception("User email not found in unverified alumni list.");
        }
    }

    @Override
    public Admin findAdminByCollegeName(String collegeName) {
        return adminRepository.findByCollegeName(collegeName);
    }

    @Override
    public void updateAdmin(Admin admin) {
        if (admin != null && admin.getEmail() != null) {
            Admin existingAdmin = adminRepository.findByEmail(admin.getEmail());
            if (existingAdmin != null) {
                existingAdmin.setPortalImages(admin.getPortalImages());
                existingAdmin.setModerators(admin.getModerators());
                existingAdmin.setUnverifiedAlumni(admin.getUnverifiedAlumni());
                adminRepository.save(existingAdmin);
            }
        }
    }

}