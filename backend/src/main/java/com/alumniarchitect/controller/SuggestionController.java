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

    @GetMapping("/user-profile/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email)) {
            return ResponseEntity.badRequest().build();
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok("add user");
        }

        List<UserProfile> profiles = suggestedEmails.stream()
                .map(userProfileService::findByEmail)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/blog/{email}")
    public ResponseEntity<?> getBlog(@PathVariable String email) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email)) {
            return ResponseEntity.badRequest().build();
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok("add user");
        }

        List<Blog> blogs = suggestedEmails.stream()
                .flatMap(user -> blogService.getBlogsByEmail(user).stream())
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogs);
    }

    private List<String> getUserAndBlogSuggestion(String email) {
        if (email.isEmpty() || !EmailService.isValidCollegeEmail(email)) {
            return Collections.emptyList();
        }

        String collegeName = EmailService.extractCollegeName(email);

        // Fetch emails of other users from the same college
        List<String> sameCollegeEmails = Optional.ofNullable(collegeGroupService.findByCollegeName(collegeName))
                .map(CollegeGroup::getEmails)
                .orElse(Collections.emptyList());

        sameCollegeEmails.remove(email);

        // Fetch skills of the requesting user
        List<String> userSkills = Optional.ofNullable(userProfileService.findByEmail(email))
                .map(UserProfile::getSkills)
                .orElse(Collections.emptyList());

        Map<String, Integer> emailToPoints = new HashMap<>();

        // Case 1: Both College and Skills Exist
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

        // Case 2: No College Users, Use Only Skills
        if (sameCollegeEmails.isEmpty() && !userSkills.isEmpty()) {
            for (String skill : userSkills) {
                List<String> usersWithSkill = Optional.ofNullable(skillsService.getSkillByName(skill))
                        .map(skillObj -> skillObj.getEmails())
                        .orElse(Collections.emptyList());

                for (String user : usersWithSkill) {
                    emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
                }
            }
        }

        // Case 3: No Skills, Use Only College
        if (!sameCollegeEmails.isEmpty() && userSkills.isEmpty()) {
            for (String user : sameCollegeEmails) {
                emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
            }
        }

        // Case 4: No College, No Skills → Return "add user"
        if (sameCollegeEmails.isEmpty() && userSkills.isEmpty()) {
            return Collections.emptyList();
        }

        // Sort by highest points and return the top 10
        return emailToPoints.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }
}
