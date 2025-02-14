package com.alumniarchitect.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Document(collection = "admin")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin {

    @Id
    private String id;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String fullName;
    private String collegeName;
    private List<String> moderators = new ArrayList<>();
    private HashMap<User, String> unverifiedAlumni = new HashMap<>();
    private List<User> users = new ArrayList<>();
    private List<String> portalImages = new ArrayList<>();
}
