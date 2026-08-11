package com.maxshkrabak.cartracker.vehicle.mapping;

import com.maxshkrabak.cartracker.vehicle.dto.VehicleDTO;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleRequest;
import com.maxshkrabak.cartracker.vehicle.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.vehicle.entity.Vehicle;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    VehicleDTO toDto(Vehicle vehicle);

    @Mapping(target = "vid", ignore = true)
    Vehicle toEntity(VehicleRequest request);

    @Mapping(target = "vid", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateVehicleFromRequest(VehicleUpdateRequest request, @MappingTarget Vehicle vehicle);
}
