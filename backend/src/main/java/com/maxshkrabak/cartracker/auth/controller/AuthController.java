package com.maxshkrabak.cartracker.auth.controller;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.*;
import com.maxshkrabak.cartracker.auth.entity.User;
import com.maxshkrabak.cartracker.auth.security.CustomUserDetails;
import com.maxshkrabak.cartracker.auth.service.EmailService;
import com.maxshkrabak.cartracker.auth.service.PasswordResetService;
import com.maxshkrabak.cartracker.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;
    private final EmailService emailService;
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

    @PatchMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).body("Password has been reset.");
    }

//    @PatchMapping("/password/{id}")
//    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request) {
//        userService.changePassword(id, request);
//        return ResponseEntity.ok().body("Password changed.");
//    }

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
