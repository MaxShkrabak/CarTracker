package com.maxshkrabak.cartracker.service;

import java.util.List;
import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import com.maxshkrabak.cartracker.exception.InvalidPasswordException;
import com.maxshkrabak.cartracker.exception.UserAccountDoesNotExist;
import com.maxshkrabak.cartracker.exception.UsernameAlreadyExistsException;
import com.maxshkrabak.cartracker.mapper.UserMapper;
import com.maxshkrabak.cartracker.model.dto.LoginRequest;
import com.maxshkrabak.cartracker.model.dto.PasswordChangeRequest;
import com.maxshkrabak.cartracker.model.dto.RegisterRequest;
import com.maxshkrabak.cartracker.model.dto.UserDTO;
import com.maxshkrabak.cartracker.model.dto.UserUpdateRequest;
import com.maxshkrabak.cartracker.model.entity.User;
import com.maxshkrabak.cartracker.repository.UserRepository;
import com.maxshkrabak.cartracker.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public UserDTO getUserDTO(Long uid) {
        return userMapper.toDto(userRepo.findById(uid).orElseThrow(() -> new UserAccountDoesNotExist(uid)));
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
