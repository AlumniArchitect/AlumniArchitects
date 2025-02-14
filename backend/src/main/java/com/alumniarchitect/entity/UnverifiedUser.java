package com.alumniarchitect.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "unverifieduser")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnverifiedUser {

    public UnverifiedUser(String email, User user) {
        this.email = email;
        this.user = user;
    }

    @Id
    private String id;
    private String email;
    private User user;
}
