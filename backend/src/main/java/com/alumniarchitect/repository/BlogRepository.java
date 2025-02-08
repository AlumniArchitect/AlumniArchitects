package com.alumniarchitect.repository;

import com.alumniarchitect.entity.Blog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends MongoRepository<Blog, String> {

    List<Blog> findByEmail(String email);
}
