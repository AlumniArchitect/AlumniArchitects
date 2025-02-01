package com.alumniarchitect.service.CollageGroup;

import com.alumniarchitect.entity.CollegeGroup;
import com.alumniarchitect.repository.CollegeGroupRepository;
import com.alumniarchitect.service.Email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollageGroupServiceImpl implements CollageGroupService {

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
    public List<CollegeGroup> getAllGroups() {
        return collegeGroupRepository.findAll();
    }
}