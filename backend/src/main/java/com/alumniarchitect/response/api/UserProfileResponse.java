package com.alumniarchitect.response.api;

import com.alumniarchitect.entity.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {

    private boolean status;
    private String message;
    private UserProfile userProfile;
}
