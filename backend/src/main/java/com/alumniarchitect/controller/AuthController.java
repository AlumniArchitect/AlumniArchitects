package com.alumniarchitect.controller;

import com.alumniarchitect.entity.User;
import com.alumniarchitect.repository.UserRepository;
import com.alumniarchitect.request.AuthRequest;
import com.alumniarchitect.response.AuthResponse;
import com.alumniarchitect.service.user.CustomUserDetailService;
import com.alumniarchitect.service.email.EmailService;
import com.alumniarchitect.service.user.UserService;
import com.alumniarchitect.utils.Jwt.JwtProvider;
import com.alumniarchitect.utils.OTP.OTPUtils;
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
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final Map<String, String> otpStorage = new HashMap<>();

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) throws Exception {

        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use");
        }

        String otp = OTPUtils.generateOTP();
        otpStorage.put(user.getEmail(), otp);
        emailService.sendVerificationOtpMail(user.getEmail(), otp);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok("OTP sent to email. Verify to complete registration.");
    }

    @GetMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, false, "Invalid OTP"));
        }

        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, false, "User not found"));
        }

        user.setVerified(true);
        userService.saveUser(user);
        otpStorage.remove(email);

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



//    @PutMapping("/forgot-password")
//    public ResponseEntity<AuthResponse> forgotPassword(AuthRequest authRequest) {
//
//    }
}
