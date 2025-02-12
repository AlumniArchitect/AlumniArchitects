package com.alumniarchitect.service.user;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.UserRepository;
import com.alumniarchitect.service.blog.BlogService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.utils.jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlogService blogService;

    @Autowired
    private SkillsService skillsService;

    @Autowired
    private CollegeGroupService collegeGroupService;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
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
    public User findById(String id) throws Exception {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return user.get();
        }

        throw new Exception("User not found.");
    }

    @Override
    public void deleteAccount(User user) {
        userRepository.delete(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public String getFullName(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return null;
        }else {
            return user.getFullName();
        }
    }

    @Override
    public boolean isVerified(String email) {
        return userRepository.findByEmail(email).isVerified();
    }
}
