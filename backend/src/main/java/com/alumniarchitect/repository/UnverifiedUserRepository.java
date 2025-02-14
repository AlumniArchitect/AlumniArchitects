package com.alumniarchitect.repository;

import com.alumniarchitect.entity.UnverifiedUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnverifiedUserRepository extends MongoRepository<UnverifiedUser, String> {
    UnverifiedUser findByEmail(String email);
}
