package com.alumniarchitect.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Education {

    private String type;
    private String name;
    private String year;
    private float cgpa;
}
