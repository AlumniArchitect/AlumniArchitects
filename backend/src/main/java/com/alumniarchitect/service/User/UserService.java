package com.alumniarchitect.service.User;

import com.alumniarchitect.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    void deleteAccount(User savedUser);

    List<User> findAll();

    String getFullName(String email);

    boolean isVerified(String email);
}
