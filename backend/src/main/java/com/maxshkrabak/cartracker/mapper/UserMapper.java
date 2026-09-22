package com.maxshkrabak.cartracker.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.maxshkrabak.cartracker.model.dto.RegisterRequest;
import com.maxshkrabak.cartracker.model.dto.UserDTO;
import com.maxshkrabak.cartracker.model.dto.UserUpdateRequest;
import com.maxshkrabak.cartracker.model.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserDTO toDto(User user);

    @Mapping(target = "uid", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "uid", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);
}
