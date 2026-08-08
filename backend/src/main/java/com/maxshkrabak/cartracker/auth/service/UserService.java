package com.maxshkrabak.cartracker.auth.service;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.LoginRequest;
import com.maxshkrabak.cartracker.auth.dto.request.RegisterRequest;
import com.maxshkrabak.cartracker.auth.dto.request.PasswordChangeRequest;
import com.maxshkrabak.cartracker.auth.dto.request.UserUpdateRequest;
import com.maxshkrabak.cartracker.auth.entity.Users;
import com.maxshkrabak.cartracker.auth.exception.InvalidPasswordException;
import com.maxshkrabak.cartracker.auth.exception.UserAccountDoesNotExist;
import com.maxshkrabak.cartracker.auth.exception.UsernameAlreadyExistsException;
import com.maxshkrabak.cartracker.auth.mapper.UserMapper;
import com.maxshkrabak.cartracker.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // listing all users
    public List<Users> getUsers() {
        return userRepo.findAll();
    }

    // creating a new user
    public UserDTO createUser(RegisterRequest registerRequest) {
       if (userRepo.existsByUsername(registerRequest.username())) {
           throw new UsernameAlreadyExistsException(registerRequest.username());
       }

       Users user = userMapper.toEntity(registerRequest);

       user.setActivated(false);
       user.setPassword(passwordEncoder.encode(registerRequest.password()));
       
       
       return userMapper.toDto(userRepo.save(user));
    }

    // deleting a user
    public void deleteUser(Long id) {
        Users user = userRepo.findById(id).orElseThrow(() -> new UserAccountDoesNotExist(id));

        userRepo.delete(user);
    }

    public Users updateUser(Long id, UserUpdateRequest updateRequest) {
        Users user = userRepo.findById(id).orElseThrow(() -> new UserAccountDoesNotExist(id));

        // only update changed values
        if (updateRequest.username() != null) {
            user.setUsername(updateRequest.username());
        }
        if (updateRequest.firstName() != null) {
            user.setFirstName(updateRequest.firstName());
        }
        if (updateRequest.lastName() != null) {
            user.setLastName(updateRequest.lastName());
        }

        return userRepo.save(user);
    }

    public Users changePassword(Long id, PasswordChangeRequest changeRequest) {
        Users user = userRepo.findById(id).orElseThrow(() -> new UserAccountDoesNotExist(id));

        if (!passwordEncoder.matches(changeRequest.password(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is wrong.");
        }

        user.setPassword(passwordEncoder.encode(changeRequest.newPassword()));
        return userRepo.save(user);
    }

    public UserDTO login(LoginRequest loginRequest) {
        Users user = userRepo.findByUsername(loginRequest.username()).orElseThrow(() -> new UserAccountDoesNotExist(null));

        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new InvalidPasswordException("Incorrect username or password");
        }

        return userMapper.toDto(user);
    }

}
