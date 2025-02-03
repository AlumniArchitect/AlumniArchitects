package com.alumniarchitect.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class BeanConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", System.getProperty("CLOUD_NAME"));
        config.put("api_key", System.getProperty("API_KEY"));
        config.put("api_secret", System.getProperty("API_SECRET"));
        config.put("secure", "true");

        Cloudinary cloudinary;
        try {
            cloudinary = new Cloudinary(config);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        return cloudinary;
    }
}
