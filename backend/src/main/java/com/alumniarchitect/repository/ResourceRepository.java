package com.alumniarchitect.repository;

import com.alumniarchitect.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByBranch(String branch);
    List<Resource> findBySem(String sem);
    List<Resource> findByEmail(String email);
}
