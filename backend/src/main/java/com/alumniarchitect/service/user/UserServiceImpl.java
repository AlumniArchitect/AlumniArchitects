package com.alumniarchitect.service.user;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.UserRepository;
import com.alumniarchitect.utils.Jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByJWT(String jwt) throws Exception {
        String email = JwtProvider.getEmailFromToken(jwt);

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new Exception("User not found.");
        }

        return user;
    }

    @Override
    public User findById(Long id) throws Exception {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return user.get();
        }

        throw new Exception("User not found.");
    }
}
