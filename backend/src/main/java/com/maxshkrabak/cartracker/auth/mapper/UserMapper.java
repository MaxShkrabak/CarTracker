package com.maxshkrabak.cartracker.auth.mapper;

import com.maxshkrabak.cartracker.auth.dto.request.UserUpdateRequest;
import org.mapstruct.*;

import com.maxshkrabak.cartracker.auth.dto.UserDTO;
import com.maxshkrabak.cartracker.auth.dto.request.RegisterRequest;
import com.maxshkrabak.cartracker.auth.entity.User;


@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);

    @Mapping(target = "uid", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "uid", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);
}
