package com.alumniarchitect.service.unverifiedUser;

import com.alumniarchitect.entity.UnverifiedUser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UnverifiedUserService {

    void addUnverifiedUser(UnverifiedUser unverifiedUser);
    UnverifiedUser findByEmail(String email);
    List<UnverifiedUser> findAll();
    void deleteUnverifiedUser(UnverifiedUser unverifiedUser);
}
