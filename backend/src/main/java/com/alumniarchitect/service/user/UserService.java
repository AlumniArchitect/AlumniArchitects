package com.alumniarchitect.service.user;

import com.alumniarchitect.entity.User;
import org.springframework.stereotype.Component;

@Component
public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    User findByJWT(String jwt) throws Exception;

    User findById(Long id) throws Exception;

    void deleteAccount(User savedUser);
}
