package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record DriveSampleRequest (
    Instant recordedAt,
    Integer rpm,
    Integer kph,
    Integer coolantTempC
){
}
