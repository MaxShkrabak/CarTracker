package com.maxshkrabak.cartracker.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.maxshkrabak.cartracker.model.dto.VehicleDTO;
import com.maxshkrabak.cartracker.model.dto.VehicleRequest;
import com.maxshkrabak.cartracker.model.dto.VehicleUpdateRequest;
import com.maxshkrabak.cartracker.model.dto.VinDecodeResponse;
import com.maxshkrabak.cartracker.model.entity.Vehicle;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VehicleMapper {
    
    VehicleDTO toDto(Vehicle vehicle);

    @Mapping(target = "vid", ignore = true)
    Vehicle toEntity(VehicleRequest request);

    @Mapping(target = "vid", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateVehicleFromRequest(VehicleUpdateRequest request, @MappingTarget Vehicle vehicle);

    Vehicle fromDecode(VinDecodeResponse decodedVehicle);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDecode(VinDecodeResponse decodedVehicle, @MappingTarget Vehicle vehicle);
}
