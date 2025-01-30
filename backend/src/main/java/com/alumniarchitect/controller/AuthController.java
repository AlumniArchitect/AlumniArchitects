package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.UserRepository;
import com.alumniarchitect.request.AuthRequest;
import com.alumniarchitect.request.VerifyOtpRequest;
import com.alumniarchitect.response.AuthResponse;
import com.alumniarchitect.service.user.CustomUserDetailService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.user.UserService;
import com.alumniarchitect.utils.Jwt.JwtProvider;
import com.alumniarchitect.utils.OTP.OTPUtils;
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

    private final Map<String, String> otpStorage = new HashMap<>();

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody User user) throws Exception {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Email is already in use"));
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
        if (!otpStorage.containsKey(verifyOtpRequest.getEmail()) ||
                !otpStorage.get(verifyOtpRequest.getEmail()).equals(verifyOtpRequest.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Invalid OTP"));
        }

        User user = userService.findByEmail(verifyOtpRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "User not found"));
        }

        if (verifyOtpRequest.getNewPassword() != null) {
            user.setPassword(passwordEncoder.encode(verifyOtpRequest.getNewPassword()));
            userService.saveUser(user);

            otpStorage.remove(verifyOtpRequest.getEmail());

            return ResponseEntity.ok(new AuthResponse(null, true, "Password updated successfully"));
        }

        user.setVerified(true);
        userService.saveUser(user);
        otpStorage.remove(verifyOtpRequest.getEmail());

        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

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
            return new ResponseEntity<>(new AuthResponse(null, false, "Invalid email or password"), HttpStatus.UNAUTHORIZED);
        }

        user.setVerified(true);
        userService.saveUser(user);

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
}