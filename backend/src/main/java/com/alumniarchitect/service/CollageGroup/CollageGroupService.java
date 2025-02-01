package com.alumniarchitect.service.CollageGroup;

import com.alumniarchitect.entity.CollegeGroup;

import java.util.List;

public interface CollageGroupService {

    void groupEmail(String email);

    List<CollegeGroup> getAllGroups();
}
