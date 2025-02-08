package com.alumniarchitect.repository;

import com.alumniarchitect.entity.CollegeGroup;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CollegeGroupRepository extends MongoRepository<CollegeGroup, String> {

    CollegeGroup findByCollegeName(String collegeName);
}