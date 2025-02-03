package com.alumniarchitect.repository;

import com.alumniarchitect.entity.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {

    UserProfile findByEmail(String email);
}
