package com.alumniarchitect.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "blog")
@Data
public class Blog {

    @Id
    private String id;
    private String email;
    private String author;
    private String title;
    private String content;
    private Long upvote;
    private List<Map<String, String>> comments;
}
