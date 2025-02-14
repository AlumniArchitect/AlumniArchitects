package com.alumniarchitect.service.admin;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminService {
    List<String> getUnverifiedAlumni(String adminId);
    List<String> getModerators(String adminId);
    void updateModerators(String adminId, List<String> moderators);
    void removeFromUnverifiedList(String adminId, String userId) throws Exception;
}
