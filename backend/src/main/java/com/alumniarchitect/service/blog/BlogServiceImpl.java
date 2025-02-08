package com.alumniarchitect.service.blog;

import com.alumniarchitect.entity.Blog;
import com.alumniarchitect.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogServiceImpl implements BlogService{

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
        return blogRepository.findByEmail(email);
    }

    @Override
    public Blog getBlogById(String id) {
        return blogRepository.findById(id).get();
    }

    @Override
    public boolean deleteBlog(String id) {
        blogRepository.deleteById(id);

        return true;
    }
}
