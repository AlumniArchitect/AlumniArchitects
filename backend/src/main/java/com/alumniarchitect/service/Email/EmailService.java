package com.alumniarchitect.service.Email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationOtpMail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Verification OTP";
        String text = "Your verification code is " + otp + ".";

        try {
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(text, true);
            mimeMessageHelper.setTo(email);

            mailSender.send(mimeMessage);
            LOGGER.info("OTP sent to: {}", email);
        } catch (Exception e) {
            LOGGER.error("Failed to send OTP: {}", e.getMessage(), e);
            throw new MessagingException("Error while sending OTP email", e);
        }
    }

    public static boolean isValidCollegeEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@(?!gmail\\.com|yahoo\\.com|outlook\\.com)([a-zA-Z0-9.-]+)\\.[a-zA-Z]{2,6}$";

        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }

    public static String extractCollegeName(String email) {
        if (!isValidCollegeEmail(email)) {
            throw new IllegalArgumentException("Invalid email or unsupported domain: " + email);
        }

        String domain = email.split("@")[1];

        return domain.split("\\.")[0];
    }
}
