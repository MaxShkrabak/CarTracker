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

        msg.setFrom("noreply@cartracker.local");
        msg.setTo(to);
        msg.setSubject("CarTracker: Reset your password");
        msg.setText("Reset link: http://localhost:4200/reset-password?token=" + token);
        mailSender.send(msg);
    }
}
