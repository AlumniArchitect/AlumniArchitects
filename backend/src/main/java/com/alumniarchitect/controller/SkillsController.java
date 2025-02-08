package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Skills;
import com.alumniarchitect.service.skills.SkillsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillsController {

    @Autowired
    private SkillsService skillsService;

    @GetMapping("/all")
    public ResponseEntity<List<Skills>> getAllSkills() {
        return ResponseEntity.ok(skillsService.getAllSkills());
    }

    @GetMapping("/{skill}")
    public ResponseEntity<Skills> getSkillByName(@PathVariable String skill) {
        Skills skillGroup = skillsService.getSkillByName(skill);
        if (skillGroup != null) {
            return ResponseEntity.ok(skillGroup);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
