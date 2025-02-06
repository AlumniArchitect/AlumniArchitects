package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.response.api.BlogResponse;
import com.alumniarchitect.service.Blog.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @PostMapping
    public ResponseEntity<BlogResponse> addBlog(Blog blog) {
        if(blog == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Blog created = blogService.save(blog);

        if(created == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new BlogResponse(false, "Blog created", created),
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
