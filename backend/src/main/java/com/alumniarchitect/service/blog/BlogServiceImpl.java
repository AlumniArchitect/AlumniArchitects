package com.alumniarchitect.service.blog;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public void save(Blog blog) {
        blogRepository.save(blog);
    }

    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public List<Blog> getBlogsByEmail(String email) {
        List<Blog> blogs = blogRepository.findByEmail(email);

        if (blogs == null || blogs.isEmpty()) {
            return null;
        }

        return blogs;
    }

    @Override
    public Blog getBlogById(String id) {
        return blogRepository.findById(id).orElse(null);
    }

    @Override
    public boolean deleteBlog(String id) {
        if (!blogRepository.existsById(id)) {
            throw new IllegalArgumentException("Blog not found with ID: " + id);
        }

        blogRepository.deleteById(id);
        return true;
    }
}