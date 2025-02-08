package com.alumniarchitect.service.skills;

import com.alumniarchitect.entity.Skills;

import java.util.List;

public interface SkillsService {

    void addEmailToSkill(String skill, String email);
    void addEmailToSkill(List<String> skills, String email);
    List<Skills> getAllSkills();
    Skills getSkillByName(String skill);}
