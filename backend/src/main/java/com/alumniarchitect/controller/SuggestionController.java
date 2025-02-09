package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.entity.CollegeGroup;
import com.alumniarchitect.entity.Skills;
import com.alumniarchitect.entity.UserProfile;
import com.alumniarchitect.service.blog.BlogService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.service.userProfile.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/suggest")
public class SuggestionController {

    @Autowired
    private CollegeGroupService collegeGroupService;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private SkillsService skillsService;

    @Autowired
    private BlogService blogService;

    @GetMapping("/user-profile/{email}/{page}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email, @PathVariable int page) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email)) {
            return ResponseEntity.badRequest().build();
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email, page);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok("add user");
        }

        List<UserProfile> profiles = suggestedEmails.stream()
                .map(userProfileService::findByEmail)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/blog/{email}/{page}")
    public ResponseEntity<?> getBlog(@PathVariable String email, @PathVariable int page) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email)) {
            return ResponseEntity.badRequest().build();
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email, page);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok("add user");
        }

        List<Blog> blogs = suggestedEmails.stream()
                .flatMap(user -> blogService.getBlogsByEmail(user).stream())
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogs);
    }

    private List<String> getUserAndBlogSuggestion(String email, int page) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email) || page < 1) {
            return Collections.emptyList();
        }

        String collegeName = EmailService.extractCollegeName(email);
        List<String> sameCollegeEmails = Optional.ofNullable(collegeGroupService.findByCollegeName(collegeName))
                .map(CollegeGroup::getEmails)
                .orElse(Collections.emptyList());

        sameCollegeEmails.remove(email);

        List<String> userSkills = Optional.ofNullable(userProfileService.findByEmail(email))
                .map(UserProfile::getSkills)
                .orElse(Collections.emptyList());

        Map<String, Integer> emailToPoints = new HashMap<>();

        if (!sameCollegeEmails.isEmpty() && !userSkills.isEmpty()) {
            for (String skill : userSkills) {
                List<String> usersWithSkill = Optional.ofNullable(skillsService.getSkillByName(skill))
                        .map(Skills::getEmails)
                        .orElse(Collections.emptyList());

                for (String user : usersWithSkill) {
                    if (sameCollegeEmails.contains(user)) {
                        emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 2);
                    } else {
                        emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
                    }
                }
            }
        }

        if (sameCollegeEmails.isEmpty() && !userSkills.isEmpty()) {
            for (String skill : userSkills) {
                List<String> usersWithSkill = Optional.ofNullable(skillsService.getSkillByName(skill))
                        .map(Skills::getEmails)
                        .orElse(Collections.emptyList());

                for (String user : usersWithSkill) {
                    emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
                }
            }
        }

        if (!sameCollegeEmails.isEmpty() && userSkills.isEmpty()) {
            for (String user : sameCollegeEmails) {
                emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
            }
        }

        if (sameCollegeEmails.isEmpty() && userSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> sortedEmails = emailToPoints.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        int pageSize = 10;
        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, sortedEmails.size());

        if (startIndex >= sortedEmails.size()) {
            return Collections.emptyList();
        }

        return sortedEmails.subList(startIndex, endIndex);
    }
}
