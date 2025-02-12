package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "userprofile")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private String resumeUrl;
    private String bio;
    private List<String> socialLinks;
    private List<String> skills;
    private String location;
    private String mobileNumber;
    private List<Education> education;
    private boolean isComplete = false;
}