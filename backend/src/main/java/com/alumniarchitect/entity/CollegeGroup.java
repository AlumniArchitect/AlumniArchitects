package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Document(collection = "collegegroup")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollegeGroup {
    @Id
    private String id;

    private String collegeName;

    private List<String> emails;
}