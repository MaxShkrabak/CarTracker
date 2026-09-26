package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record DriveSessionDTO (
    Long sessionId,
    Long vid,
    Instant startedAt,
    Instant endedAt,
    Double distanceKm,
    Integer maxRPM,
    Integer maxKPH,
    Double avgRPM,
    Double avgKPH,
    Integer maxCoolantTempC,
    Integer sampleCount
) {
    
}
