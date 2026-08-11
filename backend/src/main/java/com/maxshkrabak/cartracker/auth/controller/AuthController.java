package com.maxshkrabak.cartracker.auth.controller;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.LoginRequest;
import com.maxshkrabak.cartracker.auth.dto.request.RegisterRequest;
import com.maxshkrabak.cartracker.auth.dto.request.PasswordChangeRequest;
import com.maxshkrabak.cartracker.auth.dto.request.UserUpdateRequest;
import com.maxshkrabak.cartracker.auth.entity.User;
import com.maxshkrabak.cartracker.auth.security.CustomUserDetails;
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

    @PatchMapping("/password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.ok().body("Password changed.");
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
