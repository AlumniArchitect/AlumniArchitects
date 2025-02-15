package com.alumniarchitect.repository;

import com.alumniarchitect.entity.Referral;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralRepository extends MongoRepository<Referral, String> {
    List<Referral> findByEmail(String email);
}
