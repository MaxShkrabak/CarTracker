package com.maxshkrabak.cartracker.auth.service;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.LoginRequest;
import com.maxshkrabak.cartracker.auth.dto.request.PasswordChangeRequest;
import com.maxshkrabak.cartracker.auth.dto.request.RegisterRequest;
import com.maxshkrabak.cartracker.auth.dto.request.UserUpdateRequest;
import com.maxshkrabak.cartracker.auth.entity.PasswordResetToken;
import com.maxshkrabak.cartracker.auth.entity.User;
import com.maxshkrabak.cartracker.auth.exception.InvalidPasswordException;
import com.maxshkrabak.cartracker.auth.exception.UserAccountDoesNotExist;
import com.maxshkrabak.cartracker.auth.exception.UsernameAlreadyExistsException;
import com.maxshkrabak.cartracker.auth.mapper.UserMapper;
import com.maxshkrabak.cartracker.auth.repository.PasswordTokenRepository;
import com.maxshkrabak.cartracker.auth.repository.UserRepository;
import com.maxshkrabak.cartracker.auth.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Time;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    private final EmailService emailService;

    // listing all users
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    // creating a new user
    public UserDTO createUser(RegisterRequest registerRequest) {
        if (userRepo.existsByUsername(registerRequest.username())) {
            throw new UsernameAlreadyExistsException(registerRequest.username());
        }

        User user = userMapper.toEntity(registerRequest);

        user.setUsername(registerRequest.username().toLowerCase(Locale.ROOT));
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setActivated(true); // TODO: Logic for this later

        return userMapper.toDto(userRepo.save(user));
    }

    // deleting a user
    public void deleteUser(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new UserAccountDoesNotExist(id));

        userRepo.delete(user);
    }

    @Transactional
    public UserDTO updateUser(Long uid, UserUpdateRequest request) {
        User user = userRepo.findById(uid).orElseThrow(() -> new UserAccountDoesNotExist(uid));
        userMapper.updateUserFromRequest(request, user);
        return userMapper.toDto(user);
    }

    public UserDTO login(LoginRequest loginRequest, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username().trim().toLowerCase(Locale.ROOT),
                        loginRequest.password()
                )
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        return userMapper.toDto(userRepo.findById(principal.getUid()).orElseThrow());
    }

    // TODO: needs updating
    public User changePassword(Long id, PasswordChangeRequest changeRequest) {
        User user = userRepo.findById(id).orElseThrow(() -> new UserAccountDoesNotExist(id));

        if (!passwordEncoder.matches(changeRequest.password(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is wrong.");
        }

        user.setPassword(passwordEncoder.encode(changeRequest.newPassword()));
        return userRepo.save(user);
    }

}
