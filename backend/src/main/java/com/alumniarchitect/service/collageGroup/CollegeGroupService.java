package com.alumniarchitect.service.collageGroup;

import com.alumniarchitect.entity.CollegeGroup;

import java.util.List;

public interface CollegeGroupService {

    void groupEmail(String email);

    List<CollegeGroup> getAllCollegeGroups();

    CollegeGroup findByCollegeName(String collageName);
}
