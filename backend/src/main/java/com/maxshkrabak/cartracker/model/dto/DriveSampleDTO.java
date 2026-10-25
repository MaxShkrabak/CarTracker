package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record DriveSampleDTO (
    Instant recordedAt,
    String signal,
    Double value
){
    
}
