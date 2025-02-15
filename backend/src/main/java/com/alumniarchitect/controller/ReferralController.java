package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Referral;
import com.alumniarchitect.service.referral.ReferralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    @Autowired
    private ReferralService referralService;

    @PostMapping
    public ResponseEntity<Referral> addReferral(@RequestBody Referral referral) {
        referralService.addReferral(referral);

        return new ResponseEntity<>(referral, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Referral>> getAllReferrals() {
        return new ResponseEntity<>(referralService.getAllReferrals(), HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Referral>> getReferralByEmail(@PathVariable String email) {
        List<Referral> referrals = referralService.getReferralsByEmail(email);

        if (referrals.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(referrals, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteReferral(@PathVariable String id) {
        referralService.deleteReferral(id);
    }
}
