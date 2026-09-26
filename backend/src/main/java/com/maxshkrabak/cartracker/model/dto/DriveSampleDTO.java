package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record DriveSampleDTO (
    Instant recordedAt,
    Integer rpm,
    Integer kph,
    Integer coolantTempC
){
    
}
