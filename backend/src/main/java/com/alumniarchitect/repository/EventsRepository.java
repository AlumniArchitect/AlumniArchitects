package com.alumniarchitect.repository;

import com.alumniarchitect.entity.Events;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventsRepository extends MongoRepository<Events, String> {
    Optional<Events> findByEmail(String email);

    List<Events> findAllByEmail(String email);
}
