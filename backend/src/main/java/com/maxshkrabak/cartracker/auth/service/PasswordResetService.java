package com.maxshkrabak.cartracker.auth.service;

import com.maxshkrabak.cartracker.auth.dto.request.ForgotPasswordRequest;
import com.maxshkrabak.cartracker.auth.dto.request.ResetPasswordRequest;
import com.maxshkrabak.cartracker.auth.dto.request.VerifyResetTokenRequest;
import com.maxshkrabak.cartracker.auth.entity.PasswordResetToken;
import com.maxshkrabak.cartracker.auth.entity.User;
import com.maxshkrabak.cartracker.auth.exception.InvalidResetTokenException;
import com.maxshkrabak.cartracker.auth.repository.PasswordTokenRepository;
import com.maxshkrabak.cartracker.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.InvalidRelationIdException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
@AllArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final PasswordTokenRepository tokenRepository;
    private final EmailService emailService;
    private static final SecureRandom RANDOM = new SecureRandom();

    private String sha256(String input) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    public PasswordResetToken verifyToken(String token) {
        Instant now = Instant.now();
        PasswordResetToken resetToken = tokenRepository.findByTokenHash(sha256(token)).orElseThrow(InvalidResetTokenException::new);

        if (resetToken.getUsedAt() != null) { throw new InvalidResetTokenException(); }
        if (resetToken.getExpiresAt().isBefore(now)) { throw new InvalidResetTokenException(); }

        return resetToken;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = verifyToken(request.token());

        resetToken.setUsedAt(Instant.now());

        resetToken.getUser().setPassword(passwordEncoder.encode(request.newPassword()));
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepo.findByUsername(request.email()).orElseThrow(() -> new UsernameNotFoundException("Email does not exist."));

        tokenRepository.markAllUsedForUser(user, Instant.now());

        // create and set new token for user
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setCreatedAt(Instant.now());
        token.setExpiresAt(token.getCreatedAt().plusSeconds(300)); // 5 minute expiration
        token.setTokenHash(sha256(rawToken));
        tokenRepository.save(token);

        emailService.sendPasswordReset(user.getUsername(), rawToken);
    }
}
