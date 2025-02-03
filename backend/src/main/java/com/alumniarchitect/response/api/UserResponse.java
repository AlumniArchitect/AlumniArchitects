package com.alumniarchitect.response.api;

import com.alumniarchitect.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private boolean status;
    private String message;
    private User user;
}
