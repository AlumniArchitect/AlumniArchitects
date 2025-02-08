package com.alumniarchitect.response.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillsResponse {

    private boolean status;
    private String message;
    private List<String> emails;
}
