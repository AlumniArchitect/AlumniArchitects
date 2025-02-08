package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "skills")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Skills {

    @Id
    private String id;
    private String name;
    private List<String> emails;
}
