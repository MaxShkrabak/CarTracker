package com.maxshkrabak.cartracker.auth.mapper;

import org.springframework.stereotype.Component;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.RegisterRequest;
import com.maxshkrabak.cartracker.auth.entity.Users;

@Component
public class UserMapper {
    public Users toEntity(RegisterRequest request) {
        Users user = new Users();
        user.setUsername(request.username());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        
        return user;
    }

    public UserDTO toDto(Users user) {
        return new UserDTO(
            user.getUid(), user.getUsername(), 
            user.getFirstName(), user.getLastName(), 
            user.isActivated()
        );
    }
}
