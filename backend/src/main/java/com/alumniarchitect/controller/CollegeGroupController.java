package com.alumniarchitect.controller;

import com.alumniarchitect.response.api.CollegeGroupResponse;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alumniarchitect.entity.CollegeGroup;

import java.util.List;

@Controller
@RequestMapping("/api/collage-group")
public class CollegeGroupController {

    @Autowired
    private CollegeGroupService collegeGroupService;

    @GetMapping("/{collegeEmail}")
    public ResponseEntity<CollegeGroupResponse> getCollegeGroup(@PathVariable String collegeEmail) {
        if(!EmailService.isValidCollegeEmail(collegeEmail)) {
            return new ResponseEntity<>(new CollegeGroupResponse(false, "Provide valid email", null), HttpStatus.NOT_FOUND);
        }

        String collegeName = EmailService.extractCollegeName(collegeEmail);

        CollegeGroup collegeGroup = collegeGroupService.getCollegeGroupsByName(collegeName);

        if(collegeGroup == null) {
            return new ResponseEntity<>(new CollegeGroupResponse(false, "No college details found", null), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new CollegeGroupResponse(true, "Success", collegeGroup), HttpStatus.FOUND);
    }

    @GetMapping("/all-college-group")
    public ResponseEntity<List<CollegeGroup>> getAllCollegeGroup() {
        List<CollegeGroup> collegeGroups = collegeGroupService.getAllCollegeGroups();

        return new ResponseEntity<>(collegeGroups, HttpStatus.OK);
    }
}