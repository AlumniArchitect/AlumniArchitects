package com.alumniarchitect.request.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceRequest {
    private String email;
    private String title;
    private String description;
    private String sem;
    private String branch;
}
