package com.maxshkrabak.cartracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maxshkrabak.cartracker.model.dto.ForgotPasswordRequest;
import com.maxshkrabak.cartracker.model.dto.LoginRequest;
import com.maxshkrabak.cartracker.model.dto.RegisterRequest;
import com.maxshkrabak.cartracker.model.dto.ResetPasswordRequest;
import com.maxshkrabak.cartracker.model.dto.UserDTO;
import com.maxshkrabak.cartracker.model.dto.UserUpdateRequest;
import com.maxshkrabak.cartracker.model.dto.VerifyResetTokenRequest;
import com.maxshkrabak.cartracker.model.entity.User;
import com.maxshkrabak.cartracker.security.CustomUserDetails;
import com.maxshkrabak.cartracker.service.PasswordResetService;
import com.maxshkrabak.cartracker.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping()
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(principal.getUid(), request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request);
        return ResponseEntity.status(HttpStatus.OK).body("Password reset token has been sent.");
    }

    @PostMapping("/verify-reset-token")
    public ResponseEntity<String> verifyResetToken(@RequestBody VerifyResetTokenRequest request) {
        passwordResetService.verifyToken(request.email(), request.token());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(userService.login(loginRequest, request, response));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(userService.createUser(registerRequest));
    }
}
