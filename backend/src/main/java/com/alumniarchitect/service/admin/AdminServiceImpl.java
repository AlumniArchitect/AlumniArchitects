package com.alumniarchitect.service.admin;

import com.alumniarchitect.entity.Admin;
import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.AdminRepository;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CollegeGroupService collegeGroupService;

    @Override
    public List<String> getUnverifiedAlumni(String adminId) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        return admin != null ? admin.getUnverifiedAlumni() : null;
    }

    @Override
    public List<String> getModerators(String adminId) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        return admin != null ? admin.getModerators() : null;
    }

    @Override
    public void updateModerators(String adminId, List<String> moderators) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        if (admin != null) {
            admin.setModerators(moderators);
            adminRepository.save(admin);
        }
    }

    @Override
    public void removeFromUnverifiedList(String adminId, String userId) throws Exception {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        if (admin != null && admin.getUnverifiedAlumni().remove(userId)) {
            User user = userService.findById(userId);
            user.setVerified(true);
            userService.saveUser(user);
            adminRepository.save(admin);
        }
    }
}
