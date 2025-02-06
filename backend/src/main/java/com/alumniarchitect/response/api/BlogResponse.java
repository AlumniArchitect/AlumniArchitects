package com.alumniarchitect.response.api;

import com.alumniarchitect.entity.Blog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponse {

    private boolean status;
    private String message;
    private Blog blog;
}
