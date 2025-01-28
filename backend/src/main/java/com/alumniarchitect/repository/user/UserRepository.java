package com.alumniarchitect.repository.user;

import com.alumniarchitect.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
