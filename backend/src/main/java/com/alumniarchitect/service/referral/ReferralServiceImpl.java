package com.alumniarchitect.service.referral;

import com.alumniarchitect.entity.Referral;
import com.alumniarchitect.repository.ReferralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReferralServiceImpl implements ReferralService {

    @Autowired
    ReferralRepository referralRepository;

    @Override
    public void addReferral(Referral referral) {
        referralRepository.save(referral);
    }

    @Override
    public List<Referral> getAllReferrals() {
        return referralRepository.findAll();
    }

    @Override
    public List<Referral> getReferralsByEmail(String email) {
        return referralRepository.findByEmail(email);
    }

    @Override
    public Referral getReferralById(String id) {
        Optional<Referral> referral = referralRepository.findById(id);

        return referral.orElse(null);
    }

    @Override
    public void deleteReferral(String id) {
        referralRepository.deleteById(id);
    }
}
