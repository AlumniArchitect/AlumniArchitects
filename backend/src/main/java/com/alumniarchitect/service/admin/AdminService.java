package com.alumniarchitect.service.admin;

import com.alumniarchitect.entity.Admin;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminService {
    void addAdmin(Admin admin);
    Admin findAdminByEmail(String email);
    List<String> getUnverifiedAlumni(String adminId);
    List<String> getModerators(String adminId);
    void updateModerators(String adminId, List<String> moderators);
    void removeFromUnverifiedList(String adminId, String userId) throws Exception;
    Admin findAdminByCollegeName(String collegeName);
    void updateAdmin(Admin admin);
}
