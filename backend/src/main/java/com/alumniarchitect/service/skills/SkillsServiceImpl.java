package com.alumniarchitect.service.skills;

import com.alumniarchitect.entity.Skills;
import com.alumniarchitect.repository.SkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillsServiceImpl implements SkillsService {

    @Autowired
    private SkillsRepository skillsRepository;

    @Override
    public void addEmailToSkill(String skill, String email) {
        try {
            Skills skillGroup = skillsRepository.findByName(skill);

            if (skillGroup == null) {
                skillGroup = new Skills();
                skillGroup.setName(skill);
                skillGroup.setEmails(new ArrayList<>());
            }

            if (!skillGroup.getEmails().contains(email)) {
                skillGroup.getEmails().add(email);
            }

            skillsRepository.save(skillGroup);

        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public void addEmailToSkill(List<String> skills, String email) {
        while (!skills.isEmpty()) {
            addEmailToSkill(skills.get(0), email);
            skills.remove(0);
        }
    }

    @Override
    public List<Skills> getAllSkills() {
        return skillsRepository.findAll();
    }

    @Override
    public Skills getSkillByName(String skill) {
        return skillsRepository.findByName(skill);
    }
}
