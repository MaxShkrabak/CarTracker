package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record DriveSessionRequest (
    Instant startedAt,
    Instant endedAt
){    
}
