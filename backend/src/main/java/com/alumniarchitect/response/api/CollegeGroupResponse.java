package com.alumniarchitect.response.api;

import com.alumniarchitect.entity.CollegeGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollegeGroupResponse {

    private boolean status;
    private String message;
    private CollegeGroup collegeGroup;
}
