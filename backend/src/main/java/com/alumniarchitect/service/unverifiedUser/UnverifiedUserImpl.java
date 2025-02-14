package com.alumniarchitect.service.unverifiedUser;

import com.alumniarchitect.entity.UnverifiedUser;
import com.alumniarchitect.repository.UnverifiedUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnverifiedUserImpl implements UnverifiedUserService {

    @Autowired
    private UnverifiedUserRepository repo;

    @Override
    public void addUnverifiedUser(UnverifiedUser unverifiedUser) {
        repo.save(unverifiedUser);
    }

    @Override
    public UnverifiedUser findByEmail(String email) {
        return repo.findByEmail(email);
    }

    @Override
    public List<UnverifiedUser> findAll() {
        return repo.findAll();
    }

    @Override
    public void deleteUnverifiedUser(UnverifiedUser unverifiedUser) {
        repo.delete(unverifiedUser);
    }
}
