package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.response.api.BlogResponse;
import com.alumniarchitect.service.blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @PostMapping
    public ResponseEntity<String> addBlog(@RequestBody Blog blog) {
        if (blog.getEmail() == null || blog.getTitle() == null || blog.getContent() == null) {
            throw new IllegalArgumentException("Missing required fields!");
        }

        blogService.save(blog);

        return new ResponseEntity<>("created",
                HttpStatus.CREATED);
    }

    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("{email}")
    public List<Blog> getBlogsByEmail(@PathVariable String email) {
        return blogService.getBlogsByEmail(email);
    }

    @GetMapping("{id}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable String id) {
        Blog blog = blogService.getBlogById(id);

        if(blog == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new BlogResponse(true, "Success", blog),
                HttpStatus.FOUND);
    }

    @DeleteMapping("{id}")
    public boolean deleteBlog(@PathVariable String id) {
        return blogService.deleteBlog(id);
    }
}
