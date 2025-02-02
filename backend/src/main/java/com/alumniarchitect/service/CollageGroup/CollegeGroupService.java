package com.alumniarchitect.service.CollageGroup;

import com.alumniarchitect.entity.CollegeGroup;

import java.util.List;

public interface CollegeGroupService {

    void groupEmail(String email);

    List<CollegeGroup> getAllCollegeGroups();

    CollegeGroup getCollegeGroupsByName(String collageName);
}
