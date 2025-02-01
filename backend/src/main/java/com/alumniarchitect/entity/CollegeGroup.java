package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "collegegroup")
public class CollegeGroup {
    @Id
    private Long id;

    private String collegeName;

    private List<String> emails;
}