package com.alumniarchitect.service.Blog;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.response.api.BlogResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BlogService {
    Blog save(Blog blog);

    List<Blog> getAllBlogs();

    List<Blog> getBlogsByEmail(String email);

    Blog getBlogById(String id);

    boolean deleteBlog(String id);
}
