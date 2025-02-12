package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "events")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Events {

    @Id
    private String id;
    private String email;
    private String name;
    private String date;
    private String location;
    private String description;
    private String type;
    private String category;
    private String format;
    private String imgUrl;
}
