package com.alumniarchitect.repository;

import com.alumniarchitect.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
    User findByEmail(String email);
}
