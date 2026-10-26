package com.maxshkrabak.cartracker.model.dto;

import java.time.Instant;

public record VehicleStatsDTO (
    StatRecord maxSpeed,
    StatRecord maxRpm,
    StatRecord maxCoolant
){
    public record StatRecord(Integer value, Long sessionId, Instant startedAt) {}
}
