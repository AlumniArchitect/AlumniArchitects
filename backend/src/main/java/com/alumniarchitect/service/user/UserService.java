package com.alumniarchitect.service.user;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.enums.USER_TYPE;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    void deleteAccount(User savedUser);

    List<User> findUserByType(USER_TYPE type);

    List<User> findAll();

    User findById(String id) throws Exception;

    User findByJWT(String jwt) throws Exception;

    String getFullName(String email);

    boolean isVerified(String email);
}
