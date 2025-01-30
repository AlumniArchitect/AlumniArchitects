package com.alumniarchitect.entity;

import com.alumniarchitect.enums.USER_TYPE;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String fullName;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private USER_TYPE type = USER_TYPE.ALUMNI;

    private boolean isVerified = false;
}