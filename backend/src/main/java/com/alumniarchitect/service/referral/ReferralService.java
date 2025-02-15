package com.alumniarchitect.service.referral;

import com.alumniarchitect.entity.Referral;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReferralService {

    void addReferral(Referral referral);
    List<Referral> getAllReferrals();
    List<Referral> getReferralsByEmail(String email);
    Referral getReferralById(String id);
    void deleteReferral(String id);
}
