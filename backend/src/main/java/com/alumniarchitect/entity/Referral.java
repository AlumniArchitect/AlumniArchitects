package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "referral")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Referral {

    @Id
    private String id;
    private String email;
    private String role;
    private List<String> skills = new ArrayList<>();
    private String packages;
    private String HRContact;
    private String location;
}
