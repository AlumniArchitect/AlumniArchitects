package com.alumniarchitect.repository;

import com.alumniarchitect.entity.Skills;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillsRepository extends MongoRepository<Skills, String> {
    Skills findByName(String name);
}
