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
    public ResponseEntity<String> addOrUpdateBlog(@RequestBody Blog blog) {
        if (blog.getEmail() == null || blog.getTitle() == null || blog.getContent() == null) {
            throw new IllegalArgumentException("Missing required fields!");
        }

        if (blog.getId() == null) {
            blogService.save(blog);
            return new ResponseEntity<>("created", HttpStatus.ACCEPTED);
        } else {
            Blog existingBlog = blogService.getBlogById(blog.getId());

            if (existingBlog == null) {
                return new ResponseEntity<>("Blog not found!", HttpStatus.NOT_FOUND);
            }

            existingBlog.setTitle(blog.getTitle());
            existingBlog.setContent(blog.getContent());
            existingBlog.setUpvote(blog.getUpvote());
            existingBlog.setComments(blog.getComments());

            blogService.save(existingBlog);
            return new ResponseEntity<>("modified", HttpStatus.ACCEPTED);
        }
    }

    @GetMapping("/all")
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping
    public ResponseEntity<?> getBlog(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String id) {

        if (id != null) {
            Blog blog = blogService.getBlogById(id);
            if (blog == null) {
                return new ResponseEntity<>(new BlogResponse(false, "Blog not found", null),
                        HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new BlogResponse(true, "Success", blog), HttpStatus.OK);
        }

        if (email != null) {
            List<Blog> blogs = blogService.getBlogsByEmail(email);
            if (blogs.isEmpty()) {
                return new ResponseEntity<>("No blogs found for the given email!", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        }

        return new ResponseEntity<>("Please provide either 'id' or 'email' as a query parameter",
                HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/update-upvote/{id}")
    public ResponseEntity<String> updateBlogUpvote(@PathVariable String id) {
        Blog blog = blogService.getBlogById(id);

        if (blog == null) {
            return new ResponseEntity<>("Blog not found!", HttpStatus.NOT_FOUND);
        }

        blog.setUpvote(blog.getUpvote() + 1);
        blogService.save(blog);

        return new ResponseEntity<>("updated", HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBlog(@PathVariable String id) {
        if (!blogService.deleteBlog(id)) {
            return new ResponseEntity<>("Blog not found!", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
    }
}