package com.alumniarchitect.service.User;

import com.alumniarchitect.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    User findByJWT(String jwt) throws Exception;

    User findById(Long id) throws Exception;

    void deleteAccount(User savedUser);

    List<User> findAll();
}
