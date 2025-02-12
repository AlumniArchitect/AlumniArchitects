package com.alumniarchitect.service.collageGroup;

import com.alumniarchitect.entity.CollegeGroup;
import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.CollegeGroupRepository;
import com.alumniarchitect.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollegeGroupServiceImpl implements CollegeGroupService {

    @Autowired
    private CollegeGroupRepository collegeGroupRepository;

    @Override
    public void groupEmail(String email) {
        try {
            String collegeName = EmailService.extractCollegeName(email);
            CollegeGroup group = collegeGroupRepository.findByCollegeName(collegeName);

            if (group == null) {
                group = new CollegeGroup();
                group.setCollegeName(collegeName);
                group.setEmails(new ArrayList<>());
            }

            group.getEmails().add(email);
            collegeGroupRepository.save(group);

        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public List<CollegeGroup> getAllCollegeGroups() {
        return collegeGroupRepository.findAll();
    }

    @Override
    public CollegeGroup findByCollegeName(String collageName) {
        return collegeGroupRepository.findByCollegeName(collageName);
    }

    @Override
    public void deleteUser(User user) {
        String collegeName = EmailService.extractCollegeName(user.getEmail());
        CollegeGroup group = collegeGroupRepository.findByCollegeName(collegeName);

        group.getEmails().remove(user.getEmail());
        collegeGroupRepository.save(group);
    }
}