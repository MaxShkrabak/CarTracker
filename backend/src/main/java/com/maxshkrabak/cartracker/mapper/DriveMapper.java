package com.maxshkrabak.cartracker.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.maxshkrabak.cartracker.model.dto.DriveSampleDTO;
import com.maxshkrabak.cartracker.model.dto.DriveSampleRequest;
import com.maxshkrabak.cartracker.model.dto.DriveSessionDTO;
import com.maxshkrabak.cartracker.model.entity.DriveSample;
import com.maxshkrabak.cartracker.model.entity.DriveSession;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DriveMapper {

    // ---- samples ----
    DriveSampleDTO toDto(DriveSample sample);

    List<DriveSampleDTO> toSampleDtoList(List<DriveSample> samples);

    @Mapping(target = "sampleId", ignore = true)
    @Mapping(target = "driveSession", ignore = true)
    DriveSample toEntity(DriveSampleRequest request);

    // ---- sessions ----
    @Mapping(target = "vid", source = "vehicle.vid")
    DriveSessionDTO toDto(DriveSession session);

    List<DriveSessionDTO> toSessionDtoList(List<DriveSession> sessions);
}
