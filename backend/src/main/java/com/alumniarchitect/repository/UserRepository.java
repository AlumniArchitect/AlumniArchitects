package com.alumniarchitect.repository;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.enums.USER_TYPE;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    List<User> findUsersByType(USER_TYPE type);
}
