package com.alumniarchitect.controller;

import com.alumniarchitect.entity.*;
import com.alumniarchitect.service.blog.BlogService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.service.user.UserService;
import com.alumniarchitect.service.userProfile.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public Map<String, String> searchUser(@RequestParam String query) {
        if (query == null || query.isEmpty()) {
            return Collections.emptyMap();
        }

        List<User> userList = userService.findAll();

        return userList.stream()
                .filter(user -> user.getFullName() != null && user.getFullName().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toMap(User::getEmail, User::getFullName, (existing, replacement) -> existing));
    }

    @GetMapping("/user-profile/{email}/{page}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email, @PathVariable int page) {
        if (isValidRequest(email, page)) {
            return ResponseEntity.badRequest().body("Invalid email or page number.");
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email, page);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonMap("message", "No suggestions available."));
        }

        List<UserProfile> profiles = suggestedEmails.stream()
                .map(userProfileService::findByEmail)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/blog/{email}/{page}")
    public ResponseEntity<?> getBlog(@PathVariable String email, @PathVariable int page) {
        if (isValidRequest(email, page)) {
            return ResponseEntity.badRequest().body("Invalid email or page number.");
        }

        List<String> suggestedEmails = getUserAndBlogSuggestion(email, page);
        if (suggestedEmails.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonMap("message", "No suggestions available."));
        }

        List<Blog> blogs = suggestedEmails.stream()
                .map(blogService::getBlogsByEmail)
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogs);
    }

    private List<String> getUserAndBlogSuggestion(String email, int page) {
        if (isValidRequest(email, page)) {
            return Collections.emptyList();
        }

        String collegeName = EmailService.extractCollegeName(email);
        List<String> sameCollegeEmails = Optional.ofNullable(collegeGroupService.findByCollegeName(collegeName))
                .map(CollegeGroup::getEmails)
                .orElse(Collections.emptyList());

        List<String> userSkills = Optional.ofNullable(userProfileService.findByEmail(email))
                .map(UserProfile::getSkills)
                .orElse(Collections.emptyList());

        Map<String, Integer> emailToPoints = new HashMap<>();

        if (!userSkills.isEmpty()) {
            for (String skill : userSkills) {
                List<String> usersWithSkill = Optional.ofNullable(skillsService.getSkillByName(skill))
                        .map(Skills::getEmails)
                        .orElse(Collections.emptyList());

                for (String user : usersWithSkill) {
                    if (!user.equals(email)) {
                        emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) +
                                (sameCollegeEmails.contains(user) ? 2 : 1));
                    }
                }
            }
        }

        if (!sameCollegeEmails.isEmpty()) {
            for (String user : sameCollegeEmails) {
                if (!user.equals(email)) {
                    emailToPoints.put(user, emailToPoints.getOrDefault(user, 0) + 1);
                }
            }
        }

        List<String> sortedEmails = emailToPoints.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        int pageSize = 10;
        int startIndex = (page - 1) * pageSize;

        if (startIndex >= sortedEmails.size()) {
            return Collections.emptyList();
        }

        int endIndex = Math.min(startIndex + pageSize, sortedEmails.size());
        return sortedEmails.subList(startIndex, endIndex);
    }

    private boolean isValidRequest(String email, int page) {
        return email == null || email.isEmpty() || !EmailService.isValidCollegeEmail(email) || page <= 0;
    }
}