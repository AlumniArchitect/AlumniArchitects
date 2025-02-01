package com.alumniarchitect.utils.otp;

import java.util.Random;

public class OTPUtils {

    public static String generateOTP() {
        final int OTP_LENGTH = 6;
        Random rand = new Random();

        StringBuilder otp = new StringBuilder(OTP_LENGTH);

        for(int i = 0; i < OTP_LENGTH; i++) {
            otp.append(rand.nextInt(10));
        }

        return otp.toString();
    }
}
