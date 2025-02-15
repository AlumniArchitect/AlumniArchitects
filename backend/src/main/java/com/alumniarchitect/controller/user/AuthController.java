package com.alumniarchitect.controller.user;

import com.alumniarchitect.entity.Admin;
import com.alumniarchitect.entity.UnverifiedUser;
import com.alumniarchitect.entity.User;
import com.alumniarchitect.enums.USER_TYPE;
import com.alumniarchitect.request.auth.AuthRequest;
import com.alumniarchitect.request.verificaton.VerifyOtpRequest;
import com.alumniarchitect.response.auth.AuthResponse;
import com.alumniarchitect.service.admin.AdminService;
import com.alumniarchitect.service.blog.BlogService;
import com.alumniarchitect.service.collageGroup.CollegeGroupService;
import com.alumniarchitect.service.skills.SkillsService;
import com.alumniarchitect.service.unverifiedUser.UnverifiedUserService;
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
    private CollegeGroupService collegeGroupService;

    @Autowired
    private EmailService emailService;

    private final Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private SkillsService skillsService;

    @Autowired
    private UnverifiedUserService unverifiedUserService;

    @Autowired
    private AdminService adminService;

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

        if(user.getType().equals(USER_TYPE.ALUMNI)) {
            if(unverifiedUserService.findByEmail(user.getEmail()) != null) {
                return new ResponseEntity<>(new AuthResponse(null, false, "Already exist"), HttpStatus.BAD_REQUEST);
            }
        }

        String otp = OTPUtils.generateOTP();
        otpStorage.put(user.getEmail(), otp);

        emailService.sendVerificationOtpMail(user.getEmail(), otp);

        if(user.getType().equals(USER_TYPE.STUDENT)) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userService.saveUser(user);
        }else {
            UnverifiedUser unverifiedUser = new UnverifiedUser();
            unverifiedUser.setEmail(user.getEmail());
            unverifiedUser.setUser(user);

            unverifiedUserService.addUnverifiedUser(unverifiedUser);
        }

        return ResponseEntity.ok(new AuthResponse(null, true, "OTP sent to email. Verify to complete registration."));
    }

    @PostMapping("admin")
    public ResponseEntity<Boolean> addAdmin(@RequestBody Admin admin) throws MessagingException {
        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(EmailService.isValidCollegeEmail(admin.getEmail()) && Character.isDigit(admin.getEmail().charAt(0))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if(adminService.findAdminByEmail(admin.getEmail()) != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String otp = OTPUtils.generateOTP();
        otpStorage.put(admin.getEmail(), otp);

        emailService.sendVerificationOtpMail(admin.getEmail(), otp);

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        admin.setCollegeName(EmailService.extractCollegeName(admin.getEmail()));
        adminService.addAdmin(admin);

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @PostMapping("/admin/verify-otp")
    public ResponseEntity<Boolean> verifyOtpForAdmin(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        if (!validateOtp(verifyOtpRequest.getEmail(), verifyOtpRequest.getOtp())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(true, HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        if (!validateOtp(verifyOtpRequest.getEmail(), verifyOtpRequest.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Invalid OTP"));
        }

        if(!EmailService.isValidCollegeEmail(verifyOtpRequest.getEmail())) {
            return new ResponseEntity<>(new AuthResponse(null, true, "Verification done"), HttpStatus.OK);
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

        user.setVerified(true);
        userService.saveUser(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = JwtProvider.generateToken(auth);

        otpStorage.remove(email);

        try {
            collegeGroupService.groupEmail(email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(null, false, e.getMessage()));
        }

        return ResponseEntity.ok(new AuthResponse(jwt, true, "Registration successful"));
    }

    @PostMapping("/admin/signin")
    public ResponseEntity<AuthResponse> adminSignin(@RequestBody(required = false) AuthRequest authRequest, HttpServletRequest request) {
        Admin admin = adminService.findAdminByEmail(authRequest.getEmail());

        if(admin == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Admin not found"));
        }

        boolean val = passwordEncoder.matches(authRequest.getPassword(), admin.getPassword());

        if(!val) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Invalid credentials"));
        }

        return ResponseEntity.ok(new AuthResponse(null, true, "Admin authenticated successfully"));
    }

    @PostMapping("/user/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody(required = false) AuthRequest authRequest, HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token != null && JwtProvider.validateToken(token)) {
            return ResponseEntity.ok(new AuthResponse(token, true, "User already authenticated"));
        }

        User user = userService.findByEmail(authRequest.getEmail());
        if(user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "User not found"));
        }

        boolean val = passwordEncoder.matches(authRequest.getPassword(), user.getPassword());

        if(!val) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(null, false, "Invalid credentials"));
        }

        Authentication auth = authenticate(user.getEmail(), authRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);
        return ResponseEntity.ok(new AuthResponse(jwt, true, "User authenticated successfully"));
    }

    @GetMapping("/admin/{email}")
    public ResponseEntity<Admin> getAdmin(@PathVariable String email) {
        Admin admin = adminService.findAdminByEmail(email);

        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else {
            return new ResponseEntity<>(admin, HttpStatus.OK);
        }
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