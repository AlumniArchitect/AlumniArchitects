package com.alumniarchitect.service.blog;

import com.alumniarchitect.entity.Blog;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BlogService {
    void save(Blog blog);

    List<Blog> getAllBlogs();

    List<Blog> getBlogsByEmail(String email);

    Blog getBlogById(String id);

    boolean deleteBlog(String id);
}
