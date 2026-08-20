package com.maxshkrabak.cartracker.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordReset(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();

        String body = """
                Your password reset token is:

                %s

                Enter this code to reset your password. It expires in 10 minutes.
                """.formatted(token);

        msg.setFrom("noreply@cartracker.local");
        msg.setTo(to);
        msg.setSubject("CarTracker: Reset your password");
        msg.setText(body);

        mailSender.send(msg);
    }
}
