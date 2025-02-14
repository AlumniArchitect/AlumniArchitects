package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.enums.USER_TYPE;
import com.alumniarchitect.request.auth.AuthRequest;
import com.alumniarchitect.request.verificaton.VerifyOtpRequest;
import com.alumniarchitect.response.auth.AuthResponse;
import com.alumniarchitect.service.blog.BlogService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.service.user.CustomUserDetailService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.user.UserService;
import com.alumniarchitect.service.userProfile.UserProfileService;
import com.alumniarchitect.utils.jwt.JwtProvider;
import com.alumniarchitect.utils.otp.OTPUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CollegeGroupService collegeGroupService;

    private final Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private SkillsService skillsService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody User user) throws Exception {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Email is already in use"));
        }

        if(user.getType().equals(USER_TYPE.STUDENT) && !EmailService.isValidCollegeEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Provided email is invalid"));
        }

        String otp = OTPUtils.generateOTP();
        otpStorage.put(user.getEmail(), otp);

        emailService.sendVerificationOtpMail(user.getEmail(), otp);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok(new AuthResponse(null, true, "OTP sent to email. Verify to complete registration."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        if (!validateOtp(verifyOtpRequest.getEmail(), verifyOtpRequest.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Invalid OTP"));
        }

        User user = userService.findByEmail(verifyOtpRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "User not found"));
        }

        if (verifyOtpRequest.getNewPassword() != null) {
            return handlePasswordUpdate(user, verifyOtpRequest.getNewPassword());
        } else {
            return handleUserVerification(user, verifyOtpRequest.getEmail());
        }
    }

    private boolean validateOtp(String email, String otp) {
        boolean res = otpStorage.containsKey(email) && otpStorage.get(email).equals(otp);

        otpStorage.remove(email);

        return res;
    }

    private ResponseEntity<AuthResponse> handlePasswordUpdate(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.saveUser(user);
        otpStorage.remove(user.getEmail());

        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), newPassword);
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        return ResponseEntity.ok(new AuthResponse(jwt, true, "Password updated successfully"));
    }

    private ResponseEntity<AuthResponse> handleUserVerification(User user, String email) {
        if(user.getType().equals(USER_TYPE.STUDENT)) {
            user.setVerified(true);
        }
        userService.saveUser(user);
        otpStorage.remove(email);

        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        try {
            collegeGroupService.groupEmail(email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(null, false, e.getMessage()));
        }

        return ResponseEntity.ok(new AuthResponse(jwt, true, "Registration successful"));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody(required = false) AuthRequest authRequest, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token != null && JwtProvider.validateToken(token)) {
            return ResponseEntity.ok(new AuthResponse(token, true, "User already authenticated"));
        }

        User user = userService.findByEmail(authRequest.getEmail());

        if (user == null || !passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            return new ResponseEntity<>(new AuthResponse(null, false, "Invalid email or password"),
                    HttpStatus.UNAUTHORIZED);
        }

        if(!user.isVerified()) {
            return new ResponseEntity<>(new AuthResponse(null, false, "Please verify first."),
                    HttpStatus.UNAUTHORIZED);
        }

        Authentication auth = authenticate(user.getEmail(), authRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        return ResponseEntity.ok(new AuthResponse(jwt, true, "Login Success"));
    }

    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(email);

        if (userDetails == null || !passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestParam String email) throws MessagingException {

        User savedUser = userService.findByEmail(email);

        if(savedUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, false, "User not found"));
        }

        String otp = OTPUtils.generateOTP();
        emailService.sendVerificationOtpMail(email, otp);
        otpStorage.put(email, otp);

        return ResponseEntity.ok(new AuthResponse(null, true, "OTP sent to email. Verify to reset password."));
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<AuthResponse> deleteAccount(@RequestParam String email) {
        User savedUser = userService.findByEmail(email);

        if(savedUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, false, "User not found"));
        }

        blogService.deleteBlogsOfUser(email);
        skillsService.deleteSkillsOfUser(email);
        collegeGroupService.deleteUser(email);
        userProfileService.delete(email);
        userService.deleteAccount(savedUser);

        return ResponseEntity.ok(new AuthResponse(null, true, "Account deleted successfully"));
    }
}